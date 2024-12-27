//Importando tipos relativos ao express
import { Request } from "express";
//Importando crypto
import crypto from "crypto";
//Importando cliente S3/Nucket
import client from "../S3Client";
//Importando métodos para adicionar a/e deletar do bucket
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
//Importando prisma
import { PrismaClient } from "@prisma/client";
const { midia } = new PrismaClient();
//Importando DTOS
import { CreateMediaDTO } from "../dtos/media";
import { PlaylistIDParameter, PlaylistMediaQuery } from "../dtos/playlist";

async function createMediaDTO(
  req: Request<PlaylistIDParameter>,
  idPlaylist: number,
  isText: boolean
) {
  let mediaDTO: CreateMediaDTO;

  if (isText) {
    mediaDTO = {
      uuid: crypto.randomUUID(),
      content: req.body.text,
      mimetype: "text/plain",
      idPlaylist,
    };
  } else {
    //Finalizar
    mediaDTO = {
      uuid: req.uuid!,
      content: req.bucketURL!,
      mimetype: req.mimetype!,
      idPlaylist,
    };
  }
  return mediaDTO;
}

async function getAllMedia() {
  try {
    const data = await midia.findMany();
    return data;
  } catch (err) {
    throw new Error("...");
  }
}

async function getMediaByUUID(uuid: string) {
  try {
    const data = await midia.findUnique({ where: { uuid } });
    return data;
  } catch (err) {
    throw new Error("...");
  }
}

async function getMediaByPlaylistId(
  idPlaylist: number,
  query: PlaylistMediaQuery
) {
  let data;
  let count;
  try {
    //Caso tenhamos uma query page na URL
    if (query.page) {
      const take = Number(query?.limit) || 5;
      //const skip = req.query.page * take - take;
      const skip = (query.page - 1) * take;
      data = await midia.findMany({ where: { idPlaylist }, skip, take });
    } else {
      //Caso NÃO tenhamos uma query page na URL
      data = await midia.findMany({ where: { idPlaylist } });
    }

    count = await midia.count({ where: { idPlaylist } });
    return { data, count };
  } catch (err) {
    console.log(err);
    throw new Error("...");
  }
}

async function deleteMedia(uuid: string) {
  try {
    await midia.delete({ where: { uuid } });
  } catch (err) {
    throw new Error("...");
  }
}

async function deleteMediaFromBucket(uuid: string) {
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: uuid,
    });
    await client.send(deleteCommand);
  } catch (err) {
    throw new Error("...");
  }
}

//*
async function putMediaInBucket(body: Buffer, contentType: string) {
  try {
    console.log("entrou");
    console.log(client);
    //Gerando identificador único
    const uuid = crypto.randomUUID();
    //Comando pra enviar pro cliente S3
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: uuid,
      Body: body,
      ContentType: contentType,
    });
    await client.send(uploadCommand);
    return uuid;
  } catch (err) {
    console.log(process.env);
    throw new Error(err.message);
  }
}

export default {
  getAllMedia,
  getMediaByUUID,
  getMediaByPlaylistId,
  deleteMedia,
  deleteMediaFromBucket,
  putMediaInBucket,
  createMediaDTO,
};
