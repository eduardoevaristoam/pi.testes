const { PrismaClient } = require("@prisma/client");
const { dispositivo } = new PrismaClient();

//Cria um novo dispositivo
exports.createDevice = async (req, res) => {
  //Um dispositivo precisa ao menos ter um nome
  if (!req.body.nome)
    return res
      .status(400)
      .json({ status: "fail", message: "Por favor, forneça um ID." });
  const deviceDataObject = {
    nome: req.body.nome,
  };
  try {
    const newDevice = await dispositivo.create({ data: deviceDataObject });
    res.status(201).json({ status: "success", data: newDevice });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

//Obtém todos os dispositivos
exports.getAllDevices = async (req, res) => {
  try {
    const data = await dispositivo.findMany();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

//Edita um dispositivo baseado em seu id (Método PATCH)
exports.editDevice = async (req, res) => {
  const id = Number(req.params?.id);
  if (!id)
    return res
      .status(400)
      .json({ status: "fail", message: "Por favor, forneça um ID." });

  //Objeto de dispositivo para ser incluído
  const deviceDataObject = {
    nome: req.body.nome,
    idPlaylist: req.body.playlist,
  };

  try {
    const updatedDevice = await dispositivo.update({
      where: { id },
      data: deviceDataObject,
    });
    res.status(200).json({ status: "success", updatedDevice });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.deleteDevice = async (req, res) => {
  const id = Number(req.params?.id);
  //Isso provavelmente deverá estar em um middleware prévio
  if (!id)
    return res
      .status(400)
      .json({ status: "fail", message: "Por favor, forneça um ID." });

  try {
    await dispositivo.delete({ where: { id } });
    res
      .status(200)
      .json({ status: "success", message: "Dispositivo deletado." });
  } catch (err) {
    res.status(500).json({ status: "success", message: err.message });
  }
};

exports.getDeviceById = async (req, res) => {
  const id = Number(req.params?.id);
  //Isso provavelmente deverá estar em um middleware prévio
  if (!id)
    return res
      .status(400)
      .json({ status: "fail", message: "Por favor, forneça um ID." });

  try {
    const data = await dispositivo.findUnique({ where: { id } });
    res.status(200).json({ status: "success", data: data });
  } catch (err) {
    res.status(500).json({ status: "success", message: err.message });
  }
};
