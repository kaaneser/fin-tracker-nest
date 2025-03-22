import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from "../helper/jwt-auth.guard";
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  createBudget(
    @Body() createBudgetDto: CreateBudgetDto,
    @CurrentUser() user: any
  ) {
    return this.budgetsService.createBudget(createBudgetDto, user.userId);
  }

  @Get()
  getAllBudgets(
    @CurrentUser() user: any
  ) {
    return this.budgetsService.getAllBudgets(user.userId);
  }

  @Get(':id')
  getBudgetById(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.budgetsService.getBudgetById(id, user.userId);
  }

  @Put(':id')
  updateBudgetById(
    @Param('id') id: string, 
    @Body() updateBudgetDto: CreateBudgetDto,
    @CurrentUser() user: any
  ) {
    return this.budgetsService.updateBudgetById(id, updateBudgetDto, user.userId);
  }

  @Delete(':id')
  deleteBudgetById(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.budgetsService.deleteBudgetById(id, user.userId);
  }

  @Get(':id/status')
  getBudgetStatusById(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.budgetsService.getBudgetStatusById(id, user.userId);
  }
}
