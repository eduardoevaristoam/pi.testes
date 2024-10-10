import type {
  CreateDeviceDTO,
  EditDeviceDTO,
  DeviceIDParameter,
} from "../dtos/device";
import { PrismaClient } from "@prisma/client";
const { dispositivo } = new PrismaClient();

async function createDevice(deviceDTO: CreateDeviceDTO) {
  try {
    const newDevice = await dispositivo.create({ data: deviceDTO });
    return newDevice;
  } catch (err) {
    throw new Error("Erro ao criar dispositivo.");
  }
}

async function getAllDevices() {
  try {
    const data = await dispositivo.findMany();
    return data;
  } catch (err) {
    throw new Error("Erro ao obter dispositivos.");
  }
}

async function editDevice(deviceDTO: EditDeviceDTO, id: number) {
  try {
    const updatedDevice = await dispositivo.update({
      where: { id },
      data: deviceDTO,
    });
    return updatedDevice;
  } catch (err) {
    throw new Error("Erro ao editar dispositivo.");
  }
}

async function deleteDevice(id: number) {
  try {
    await dispositivo.delete({ where: { id } });
  } catch (err) {
    throw new Error("Erro ao deletar dispositivo.");
  }
}

async function getDeviceById(id: number) {
  try {
    const data = await dispositivo.findUnique({ where: { id } });
    return data;
  } catch (err) {
    throw new Error("Erro ao obter dispositivo.");
  }
}
export default {
  createDevice,
  getAllDevices,
  editDevice,
  deleteDevice,
  getDeviceById,
};
