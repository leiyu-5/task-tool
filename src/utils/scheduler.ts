import { Task, Member, ScheduleResult } from '../types';

/**
 * 智能任务排程算法
 * 规则：
 * 1. 1人力=8H约束
 * 2. 技能100%匹配
 * 3. 多人可选时，优先指派"技能总数最少"的人员
 * 4. 任务按北京时间升序排列
 */
export class TaskScheduler {
  /**
   * 执行排程
   * @param tasks 待排程任务列表
   * @param members 团队成员列表
   * @returns 排程结果
   */
  static scheduleTasks(tasks: Task[], members: Member[]): ScheduleResult[] {
    // 按任务截止日期升序排序
    const sortedTasks = [...tasks].sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    // 深拷贝成员数据，避免修改原始数据
    const memberCopies = JSON.parse(JSON.stringify(members)) as Member[];
    const results: ScheduleResult[] = [];

    // 遍历任务进行排程
    for (const task of sortedTasks) {
      // 查找符合技能要求且有足够剩余工时的成员
      const eligibleMembers = memberCopies.filter(member => {
        // 检查技能是否完全匹配
        const hasAllSkills = task.skills.every(skill => 
          member.skills.includes(skill)
        );
        
        // 检查剩余工时是否足够
        const remainingHours = member.weeklyCapacity - member.currentLoad;
        return hasAllSkills && remainingHours >= task.estimatedHours;
      });

      if (eligibleMembers.length > 0) {
        // 按技能总数最少排序，选择最优成员
        eligibleMembers.sort((a, b) => a.skills.length - b.skills.length);
        const selectedMember = eligibleMembers[0];

        // 更新成员负载
        selectedMember.currentLoad += task.estimatedHours;

        // 创建排程结果
        const result: ScheduleResult = {
          taskId: task.id,
          memberId: selectedMember.id,
          scheduledDate: task.dueDate,
          hours: task.estimatedHours,
          status: 'scheduled'
        };

        results.push(result);
      } else {
        // 无法排程的任务
        const result: ScheduleResult = {
          taskId: task.id,
          memberId: '',
          scheduledDate: task.dueDate,
          hours: task.estimatedHours,
          status: 'failed',
          reason: '没有符合技能要求且有足够工时的成员'
        };

        results.push(result);
      }
    }

    return results;
  }

  /**
   * 计算成员剩余工时
   * @param member 成员
   * @returns 剩余工时
   */
  static getRemainingHours(member: Member): number {
    return member.weeklyCapacity - member.currentLoad;
  }

  /**
   * 检查任务是否可以分配给成员
   * @param task 任务
   * @param member 成员
   * @returns 是否可以分配
   */
  static canAssignTask(task: Task, member: Member): boolean {
    // 检查技能是否完全匹配
    const hasAllSkills = task.skills.every(skill => 
      member.skills.includes(skill)
    );
    
    // 检查剩余工时是否足够
    const remainingHours = this.getRemainingHours(member);
    return hasAllSkills && remainingHours >= task.estimatedHours;
  }

  /**
   * 生成排程报告
   * @param results 排程结果
   * @param tasks 任务列表
   * @param members 成员列表
   * @returns 排程报告
   */
  static generateScheduleReport(results: ScheduleResult[], _tasks: Task[], members: Member[]) {
    const totalTasks = results.length;
    const scheduledTasks = results.filter(r => r.status === 'scheduled').length;
    const failedTasks = results.filter(r => r.status === 'failed').length;

    // 计算每个成员的排程情况
    const memberSchedules = members.map(member => {
      const memberResults = results.filter(r => r.memberId === member.id);
      const totalScheduledHours = memberResults.reduce((sum, r) => sum + r.hours, 0);
      const remainingHours = this.getRemainingHours(member);

      return {
        memberId: member.id,
        memberName: member.name,
        totalScheduledHours,
        remainingHours,
        taskCount: memberResults.length
      };
    });

    return {
      totalTasks,
      scheduledTasks,
      failedTasks,
      memberSchedules,
      summary: `成功排程 ${scheduledTasks} 项任务，${failedTasks} 项任务未能排程`
    };
  }
}