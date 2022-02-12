const express = require("express");
const { Op } = require("sequelize");
const { Article, Reference } = require("../tables");
const router = express.Router();

//creare rute
router
  .route("/articles")
  .get(async (req, res) => {
    try {
      const { extended, titleS,summaryS,sortBy } = req.query;
      const articles = await Article.findAll({
         include:  {
            model:Reference,
            attributes: ["id"],
          },
        attributes: extended
          ? undefined
          : { exclude: ["createdAt", "updatedAt"] },
        
          where: { [Op.and]: [
            titleS ? {
  
              title: {
                [Op.like]: titleS + '%'
              }
            } : undefined,
           
            summaryS ? {
  
              summary: {
                [Op.like]: summaryS + '%'
              }
            } : undefined,
            
            
          ]
         
          },
          order: sortBy ? [[sortBy, "ASC"]] : undefined//SORTARE
      });
     
      return res.status(200).json(articles);
    } catch (error) {
      return res.status(500).json(error);
    }
  })
  .post(async (req, res) => {
    try {
      const article = await Article.create(req.body);
      return res.status(200).json(article);
    } catch (error) {
      return res.status(500).json(error);
    }
  });



  router
  .route("/articles/:id")
  .put(async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id);
      if (article) {
        const updatedArticle = await article.update(req.body);
        return res.status(200).json(updatedArticle);
      } else {
        return res.status(404).json({ error: "Article not found" });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  })
  .delete(async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id);
      if (article) {
        await article.destroy();
        return res.status(200).send();
      } else {
        return res.status(404).json({ error: "Article not found" });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  });
  

  // //IMPORT
router.route("/import").post(async (req, res) => {
  try {
    for (let m of req.body) {
      const article = await Article.create({
        title: m.title,
        summary: m.summary,
        date:m.date
      });
    
      for (let c of m.references) {
        const reference = await Reference.create({
          title: c.title,
          date: c.date,
          listOfAuthors:c.listOfAuthors,
          ArticleId: article.id,
        });
      }
    }
    return res.status(200).json({ message: "Imported successfully!" });
  } catch (e) {
    return res.status(500).json(e);
  }
});

//EXPORT
router.route("/export").get(async (req, res) => {
  try {
    const result = [];
    for (let m of await Article.findAll()) {
      const article = {
        title: m.title,
        summary: m.summary,
        date:m.date,
        references: [],
      };
      for (let c of await m.getReferences()) {
        article.references.push({
          title: c.title,
          date: c.date,
          listOfAuthors:c.listOfAuthors,
          ArticleId: article.id,
        });
      }

      result.push(article);
    }

    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Articles not found!" });
    }
  } catch (e) {
    return res.status(500).json(e);
  }
});

  

  router.route("/paginare").get(async (req, res) => {
    try {
      const query = {};
  
      const page = req.query.page;
      const limit = req.query.limit;
  
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const article = await Article.findAll(query);
      const finalArticle = article.slice(startIndex, endIndex);
  
      return res.status(200).json(finalArticle);
    } catch (err) {
      return res.status(500).json(err);
    }
  });

  module.exports = router;