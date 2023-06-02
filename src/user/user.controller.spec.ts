import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Test, TestingModule } from "@nestjs/testing";

describe("UserController", () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe("create", () => {
    it("should create a user", async () => {
      const mockCreateUser = jest
        .spyOn(userService, "create")
        .mockResolvedValueOnce(null);

      const createUserDto: CreateUserDto = {
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword",
      };

      await controller.create(createUserDto);

      expect(mockCreateUser).toHaveBeenCalledWith(createUserDto);
    });
  });
});
