const router = require("express").Router();
const { Survey, User } = require("../models");
const auth = require("../utils/auth");

//GET Route to get information from homepage.handlebars
router.get("/", async (req, res) => {
  // Renders all Handlebars.js template.
  res.render("homepage");
});

router.get("/api/surveys", async (req, res) => {
  try {
    const stressData = await Survey.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const stress = stressData.map((Survey) => Survey.get({ plain: true }));

    res.render("questions", {
      stress,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/profile/:id", auth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Survey }],
    });

    const user = userData.get({ plain: true });
    // console.log(user);
    res.render("profile", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// if user is already logged in, redirect to new route
router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/profile/:id");
    return;
  }

  res.render("profile");
});

router.get("/api/results", async (req, res) => {
  // Renders all Handlebars.js template.
  res.render("results");
});

module.exports = router;