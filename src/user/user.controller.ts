import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @Post()
  createUser(@Body() body: { email: string; name?: string }) {
    return this.userService.create(body);
  }

@Put(':id')
updateUser(
    @Param('id') id: string,
    @Body() body: { email?: string; name?: string }
) {
    return this.userService.update(Number(id), body);
}

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.delete(Number(id));
  }
}
