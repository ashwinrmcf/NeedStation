package com.example.authbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerDashboardStatsDTO {
    private Integer tasksCompleted;
    private Integer tasksThisWeek;
    private Integer tasksThisMonth;
    private BigDecimal monthlyEarnings;
    private BigDecimal weeklyEarnings;
    private BigDecimal totalEarnings;
    private Double averageRating;
    private Integer totalRatings;
    private Integer newMessages;
    private Integer pendingTasks;
    private Integer upcomingTasks;
}
