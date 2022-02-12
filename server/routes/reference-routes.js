const express = require("express");
const router = express.Router();
const { Article,Reference } = require("../tables");

router.route("/references")
.get(async (req, res) => {
  try { 
    const references = await Reference.findAll();

    return res.status(200).json(references);
  } catch (error) {
    return res.status(500).json(error);
  }
})



router
  .route("/articles/:id_a/references")
  .get(async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id_a, {
      include: [Reference]
    })
    if (article) {
      res.status(200).json(article.References)
    } else {
      res.status(404).json({ error: 'Article not found' })
    }
   } catch (err) {
     return res.status(500).json(error)
   }
  })
  .post(async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id_a)
    if (article) {
      const reference = new Reference(req.body);
      reference.ArticleId = article.id;
      await reference.save(); 
      res.status(201).json(reference);
    } else {
      res.status(404).json({ error: 'Article not found' })
    }
  } catch (error) {
    return res.status(500).json(error);
  }
  });


 
router
  .route("/articles/:id_a/references/:id_r")
  .put(async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id_a)
      if (article) {
        const references = await article.getReferences({where: {id: req.params.id_r}})
        const reference = references.shift()

        if(reference){
          reference.title = req.body.title
          reference.date = req.body.date
          reference.listOfAuthors=req.body.listOfAuthors
          await reference.save()
          return res.status(200).json(reference);
        }
        else {
          res.status(404).json({ error: 'Reference not found' })
        }
      } else {
        res.status(404).json({ error: 'Article not found' })
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  })
  .delete(async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id_a)
      if (article) {
        const references = await article.getReferences({where: {id: req.params.id_r}})
        const reference = references.shift()
        if(reference){
          await reference.destroy();
          return res.status(200).send();
        }
        else {
          res.status(404).json({ error: 'Reference not found' })
        }
      } else {
        res.status(404).json({ error: 'Article not found' })
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  });

  module.exports = router;