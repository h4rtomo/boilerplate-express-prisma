const bcrypt = require("bcrypt");
const {
  getUsers,
  createUser,
  editUserById,
  deleteUserById,
  getUser,
} = require("../../../v1/services/user.service.js");

jest.mock("../../../config/prisma.js", () => ({
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("User functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    it("should get users", async () => {
      const mockUsers = [
        { id: 1, name: "User1" },
        { id: 2, name: "User2" },
      ];
      jest.spyOn(require("../../../config/prisma.js").user, "findMany").mockResolvedValueOnce(mockUsers);

      const result = await getUsers();

      expect(result).toEqual(mockUsers);
      expect(require("../../../config/prisma.js").user.findMany).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    it("should get a user by ID", async () => {
      const mockUser = { id: 1, name: "User1" };
      jest.spyOn(require("../../../config/prisma.js").user, "findUnique").mockResolvedValueOnce(mockUser);

      const result = await getUser.byId(1);

      expect(result).toEqual(mockUser);
      expect(require("../../../config/prisma.js").user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("should throw an error if user is not found", async () => {
      jest.spyOn(require("../../../config/prisma.js").user, "findUnique").mockResolvedValueOnce(null);

      await expect(getUser.byId(1)).rejects.toThrow("User not found");
      expect(require("../../../config/prisma.js").user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe("createUser", () => {
    it("should create a user", async () => {
      const mockUserData = { name: "User1", email: "user1@example.com", password: "password123" };
      const mockCreatedUser = { id: 1, ...mockUserData };
      jest.spyOn(bcrypt, "genSalt").mockResolvedValueOnce("salt");
      jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword");
      jest.spyOn(require("../../../config/prisma.js").user, "create").mockResolvedValueOnce(mockCreatedUser);

      const result = await createUser(mockUserData);

      expect(result).toEqual(mockCreatedUser);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(expect.any(Number));
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", "salt");
      expect(require("../../../config/prisma.js").user.create).toHaveBeenCalledWith({
        data: { ...mockUserData, password: "hashedPassword" },
      });
    });
  });

  describe("editUserById", () => {
    it("should edit a user by ID", async () => {
      const mockUserData = { name: "UpdatedUser", email: "updateduser@example.com", password: "newpassword" };
      const mockUpdatedUser = { id: 1, ...mockUserData };
      jest.spyOn(getUser, "byId").mockResolvedValueOnce({ id: 1, name: "User1" });
      jest.spyOn(bcrypt, "genSalt").mockResolvedValueOnce("salt");
      jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword");
      jest.spyOn(require("../../../config/prisma.js").user, "update").mockResolvedValueOnce(mockUpdatedUser);

      const result = await editUserById(1, mockUserData);

      expect(result).toEqual(mockUpdatedUser);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(expect.any(Number));
      expect(bcrypt.hash).toHaveBeenCalledWith("newpassword", "salt");
      expect(getUser.byId).toHaveBeenCalledWith(1);
      expect(require("../../../config/prisma.js").user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...mockUserData, password: "hashedPassword" },
      });
    });
  });

  describe("deleteUserById", () => {
    it("should delete a user by ID", async () => {
      jest.spyOn(getUser, "byId").mockResolvedValueOnce({ id: 1, name: "User1" });

      await deleteUserById(1);

      expect(getUser.byId).toHaveBeenCalledWith(1);
      expect(require("../../../config/prisma.js").user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
