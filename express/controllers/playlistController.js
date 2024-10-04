const { PrismaClient } = require("@prisma/client");
const { playlist } = new PrismaClient();

//Cria uma nova playlist
exports.createPlaylist = async (req, res) => {
  //Uma playlist precisa ter ao menos nome e intervalo inicialmente
  //Isso provavelmente deverá estar em um middleware prévio
  if (!req.body.nome || !req.body.intervalo)
    return res.status(400).json({
      status: "fail",
      message: "Por favor, forneça todas as informações.",
    });

  try {
    const newPlaylist = await playlist.create({ data: req.body });
    res.status(200).json({ status: "success", data: newPlaylist });
  } catch (err) {}
};

//Obtém todas as playlists
exports.getAllPlaylists = async (req, res) => {
  try {
    const data = await playlist.findMany({
      orderBy: { id: "asc" },
      include: { _count: { select: { Midia: true } } },
    });
    res.status(200).json({ status: "success", data: data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

//Edita uma playlist baseada em seu id
exports.editPlaylist = async (req, res) => {
  const id = Number(req.params?.id);
  //Isso provavelmente deverá estar em um middleware prévio
  if (!id)
    return res
      .status(400)
      .json({ status: "fail", message: "Por favor, forneça um ID." });

  const updatedPlaylist = await playlist.update({
    where: { id },
    data: req.body,
  });
  res.status(200).json({ status: "success", data: updatedPlaylist });
};

//Deleta uma playlist baseada em seu id
exports.deletePlaylist = async (req, res) => {
  const id = Number(req.params?.id);
  //Isso provavelmente deverá estar em um middleware prévio
  if (!id)
    return res
      .status(400)
      .json({ status: "fail", message: "Por favor, forneça um ID." });

  try {
    await playlist.delete({ where: { id } });
    res.status(200).json({ status: "success", message: "Playlist deletada!" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

//Usado na página do dispositivo, após certificar-se de que, existe uma playlist associada a este
exports.getPlaylistById = async (req, res) => {
  const id = Number(req.params?.id);
  //Isso provavelmente deverá estar em um middleware prévio
  if (!id)
    return res
      .status(400)
      .json({ status: "fail", message: "Por favor, forneça um ID." });

  try {
    let data;

    //Caso tenhamos uma query media=true na URL
    if (req.query?.media === "true") {
      data = await playlist.findUnique({
        where: { id },
        include: { Midia: true },
      });
    } else {
      //Caso NÃO tenhamos uma query media na URL
      data = await playlist.findUnique({ where: { id } });
    }

    res.status(200).json({ status: "success", data: data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
