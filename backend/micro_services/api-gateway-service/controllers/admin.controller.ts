import { Request, Response } from 'express';
import ProblemService from '../../problem-service/services/problem.service';
import UserService from '../services/user.service';
import ContainerService from '../../container-service/services/container.service';

const problemService = new ProblemService();
const userService = new UserService();
const containserService = new ContainerService();

export async function createProblem(req: Request, res: Response) {
  try {
    const { problemSlug, problemName, problemDesc, problemTags, problemLevel } =
      req.body;
    const data = await problemService.insertProblem(
      problemSlug,
      problemName,
      problemDesc,
      problemTags,
      problemLevel
    );
    res.status(201).json({
      success: true,
      data,
      message: 'Problem Inserted Successfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Error while inserting problem',
    });
  }
}

export async function updateProblem(req: Request, res: Response) {
  try {
    const { problemSlug, problemName, problemDesc, problemTags, problemLevel } =
      req.body;
    const data = await problemService.updateProblem(
      problemSlug,
      problemName,
      problemDesc,
      problemTags,
      problemLevel
    );
    res.status(200).json({
      success: true,
      data,
      message: 'Problem Updated Successfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Error while updating problem',
    });
  }
}

export async function getOverview(req: Request, res: Response) {
  try {
    const problemCountByLevel = await problemService.getProblemsCountByLevel();
    const usersCount = await userService.getTotalUsers();
    const notebooksData = await containserService.getAllNotebookPods();

    let data: {
      usersCount?: number;
      problemsCount?: {
        count: number;
        problemLevel: string;
      }[];
      notebooksData?: {
        sessionId: string | undefined;
        restartCount: number | undefined;
        startTime: Date | undefined;
        currentStatus: string | undefined;
        nodeName: string | undefined;
        userId: string | undefined;
        problem: string | undefined;
        username: string | null;
        email: string | undefined;
        name: string | null;
      }[];
    } = {};

    data['usersCount'] = usersCount;
    data['problemsCount'] = problemCountByLevel;

    const userIds = notebooksData.map((item) => item.userId);
    const userDetails = await userService.getUsersById(userIds as string[]);

    data['notebooksData'] = notebooksData.map((item) => {
      return { ...item, ...userDetails[item.userId as string] };
    });

    res.status(200).json({
      success: true,
      data,
      message: 'Overview of Data',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Error while getting overview data',
    });
  }
}
