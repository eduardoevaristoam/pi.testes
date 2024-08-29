const database = require("./../database");

exports.getAllMedia = async (req, res) => {
  /*
    try {
      const query = await database.query("select * from images");
      const data = query.rows;
      console.log(data);
      res.status(200).json({ status: "success", data: data });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
    */
  res.status(500).json({ status: "error", message: "Rota em construção" });
};

exports.postMedia = async (req, res) => {
  try {
    const media = req.file.buffer;
    const base64String = media.toString("base64");
    const query = "INSERT INTO images (name) VALUES ($1)";
    await database.query(query, [base64String]);
    res.status(201).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.checkBody = (req, res, next) => {
  if (!req?.file) {
    return res
      .status(400)
      .json({ status: "fail", message: "Nenhuma mídia foi enviada." });
  }
  next();
};

exports.checkMimeType = (req, res, next) => {
  //Implementar checagem de tipo de mídias
};
