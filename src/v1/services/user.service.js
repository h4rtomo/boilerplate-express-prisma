const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const prisma = require("../../config/prisma.js");

dotenv.config();

const getUsers = async () => {
  const users = await prisma.user.findMany();

  return users;
};

const getUser = {
  byId: async (id) => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
};

const createUser = async (userData) => {
  const gens = await bcrypt.genSalt(parseInt(process.env.HASH_ROUND));
  const hashedPassword = await bcrypt.hash(userData.password, gens);
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    },
  });

  return user;
};

const editUserById = async (id, userData) => {
  await getUser.byId(id);

  const gens = await bcrypt.genSalt(parseInt(process.env.HASH_ROUND));
  const hashedPassword = await bcrypt.hash(userData.password, gens);
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    },
  });

  return user;
};

const deleteUserById = async (id) => {
  await getUser.byId(id);

  await prisma.user.delete({ where: { id } });
};

module.exports = { getUsers, createUser, deleteUserById, editUserById, getUser };
