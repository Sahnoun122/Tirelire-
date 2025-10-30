import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import User from "../models/user.model.js";
import Group from "../models/group.model.js";

jest.mock("../services/notification.service.js", () => ({
  sendNotificationEmail: jest.fn(),
}));

let mongoServer;
let adminToken;
let userToken;
let adminId;
let userId;
let groupId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const admin = await User.create({
    firstName: "Admin",
    lastName: "Test",
    email: "admin@test.com",
    password: "123456",
    role: "admin",
  });

  const user = await User.create({
    firstName: "User",
    lastName: "Test",
    email: "user@test.com",
    password: "123456",
    role: "user",
  });

  adminId = admin._id;
  userId = user._id;

  // Tokens simulés (ici, tu pourrais utiliser un vrai JWT si ton middleware le vérifie)
  adminToken = { _id: adminId.toString(), role: "admin" };
  userToken = { _id: userId.toString(), role: "user" };
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Group.deleteMany();
});

describe("✅ Groups API", () => {
  test("🟢 Créer un nouveau groupe", async () => {
    const res = await request(app)
      .post("/api/groups")
      .send({
        name: "Groupe Test",
        description: "Description test",
        contributionAmount: 100,
      })
      .set("Accept", "application/json")
      .set("user", JSON.stringify(adminToken));

    expect(res.statusCode).toBe(201);
    expect(res.body.group.name).toBe("Groupe Test");
    groupId = res.body.group._id;
  });

  test("🟢 Lister les groupes", async () => {
    await Group.create({
      name: "G1",
      contributionAmount: 50,
      creator: adminId,
      members: [{ user: adminId, status: "active", joinedAt: new Date() }],
    });

    const res = await request(app).get("/api/groups");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("🟢 Obtenir un groupe par ID", async () => {
    const group = await Group.create({
      name: "G2",
      contributionAmount: 100,
      creator: adminId,
      members: [{ user: adminId, status: "active", joinedAt: new Date() }],
    });

    const res = await request(app).get(`/api/groups/${group._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.group.name).toBe("G2");
  });

  test("🟢 Rejoindre un groupe", async () => {
    const group = await Group.create({
      name: "G3",
      contributionAmount: 100,
      creator: adminId,
      members: [{ user: adminId, status: "active", joinedAt: new Date() }],
      isOpen: true,
    });

    const res = await request(app)
      .post(`/api/groups/join/${group._id}`)
      .set("user", JSON.stringify(userToken));

    expect(res.statusCode).toBe(200);
    expect(res.body.group.members.length).toBe(2);
  });

  test("🟢 Quitter un groupe", async () => {
    const group = await Group.create({
      name: "G4",
      contributionAmount: 100,
      creator: adminId,
      members: [{ user: userId, status: "active", joinedAt: new Date() }],
    });

    const res = await request(app)
      .post(`/api/groups/leave/${group._id}`)
      .set("user", JSON.stringify(userToken));

    expect(res.statusCode).toBe(200);
    expect(res.body.group.members.length).toBe(0);
  });

  test("🟢 Démarrer un round et contribuer", async () => {
    const group = await Group.create({
      name: "G5",
      contributionAmount: 50,
      creator: adminId,
      members: [
        { user: adminId, status: "active", joinedAt: new Date() },
        { user: userId, status: "active", joinedAt: new Date() },
      ],
    });

    const roundRes = await request(app)
      .post(`/api/groups/start-round/${group._id}`)
      .set("user", JSON.stringify(adminToken));

    expect(roundRes.statusCode).toBe(200);
    expect(roundRes.body.round.roundNumber).toBe(1);

    const contributeRes = await request(app)
      .post(`/api/groups/contribute/${group._id}`)
      .send({ amount: 50 })
      .set("user", JSON.stringify(userToken));

    expect(contributeRes.statusCode).toBe(200);
    expect(contributeRes.body.round.contributions.length).toBe(1);
  });

  test("🟢 Mettre à jour un groupe", async () => {
    const group = await Group.create({
      name: "G6",
      contributionAmount: 100,
      creator: adminId,
      members: [{ user: adminId, status: "active", joinedAt: new Date() }],
    });

    const res = await request(app)
      .patch(`/api/groups/${group._id}`)
      .send({ name: "Updated Group" })
      .set("user", JSON.stringify(adminToken));

    expect(res.statusCode).toBe(200);
    expect(res.body.group.name).toBe("Updated Group");
  });

  test("🟢 Historique des rounds", async () => {
    const group = await Group.create({
      name: "G7",
      contributionAmount: 50,
      creator: adminId,
      members: [
        { user: adminId, status: "active", joinedAt: new Date() },
        { user: userId, status: "active", joinedAt: new Date() },
      ],
      rounds: [
        {
          roundNumber: 1,
          beneficiary: adminId,
          status: "completed",
          contributions: [
            { user: adminId, amount: 50, date: new Date() },
          ],
        },
      ],
    });

    const res = await request(app).get(`/api/groups/history/${group._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.rounds.length).toBe(1);
  });
});
