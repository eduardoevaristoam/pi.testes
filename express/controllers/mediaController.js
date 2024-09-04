const database = require("./../database");
const client = require("../S3Client");
const crypto = require("crypto");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

//Obtém todas as mídias
exports.getAllMedia = async (req, res) => {
  try {
    const query = await database.query("select * from midias");
    const data = query.rows;
    console.log(data);
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

//Cria uma entrada no banco de dados (caso todas os middlewares anteriores sejam favoráveis)
exports.postMedia = async (req, res) => {
  try {
    const uuid = req.uuid;
    const content = req.bucketURL;
    const mimetype = req.mimetype;
    //Parametrizando query de SQL
    const query =
      "INSERT INTO midias (uuid, content, mimetype) VALUES ($1, $2, $3)";
    await database.query(query, [uuid, content, mimetype]);
    res.status(201).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

//Obtem mídia por seu id
exports.getMediaById = async (req, res) => {
  try {
    const { id } = req.params;
    //Parametrizando query de SQL
    const sqlQuery = "select * from midias where id = $1";
    const query = await database.query(sqlQuery, [id]);
    const data = query.rows;
    //Caso a mídia não seja encontrada
    if (!data.length) {
      return res.status(404).json({
        status: "fail",
        message: "Nenhuma mídia com tal ID encontrada",
      });
    }
    //Caso a mídia for encontrada
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

//Middleware que checa se existe, de fato, um arquivo no objeto de request (usado com método POST)
exports.checkBody = (req, res, next) => {
  if (!req?.file) {
    return res
      .status(400)
      .json({ status: "fail", message: "Nenhuma mídia foi enviada." });
  }
  next();
};

//Middleware que checa se o mimetype do arquivo enviado é aceito (usado com método POST)
exports.checkMimeType = (req, res, next) => {
  console.log(req.file);
  const acceptedMimeTypes = new Map([
    // Images
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/gif", "gif"],
    ["image/bmp", "bmp"],
    ["image/webp", "webp"],
    // Videos
    ["video/mp4", "mp4"],
    ["video/mpeg", "mpeg"],
    ["video/webm", "webm"],
    ["video/x-msvideo", "avi"],
  ]);
  const mimetype = req.file.mimetype;
  if (acceptedMimeTypes.get(mimetype)) {
    //Se for aceito, incluiremos essa informação no objeto de request para usar posteriormente
    req.mimetype = mimetype;
  } else {
    return res
      .status(400)
      .json({ status: "fail", message: "Formato de arquivo não aceito" });
  }
  //console.log(req);
  next();
};

//Middleware que envia pro bucket
exports.putNewMedia = async (req, res, next) => {
  try {
    //Gerando identificador único
    const UUID = crypto.randomUUID();
    //Comando pra enviar pro cliente S3
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: UUID,
      Body: req.file.buffer,
      ContentType: req.mimetype,
    });
    await client.send(uploadCommand);
    //Setando a URL e UUID do arquivo no bucket no objeto request para persistir no banco de dados
    req.bucketURL = `https://${process.env.PROJECT_ID}.supabase.co/storage/v1/object/public/${process.env.BUCKET_NAME}/${UUID}`;
    req.uuid = UUID;
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
  next();
};

//TODO: Criar middleware que tira do bucket usando UUID - Feito
//TODO: Verificar se precisa do UUID como primary key no banco
exports.deleteMediaBucket = async (req, res, next) => {
  const UUID = req.params.uuid;
  try {
    //Comando pra enviar pro cliente S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: UUID,
    });
    await client.send(deleteCommand);
    next();
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

exports.deleteMedia = async (req, res) => {
  const UUID = req.params.uuid;
  const query = "DELETE FROM midias WHERE uuid = $1";
  try {
    await database.query(query, [UUID]);
    res.status(200).json({ status: "success", message: "Content deleted" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
