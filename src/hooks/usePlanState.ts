import { useState, useEffect, useCallback } from "react";
import { UserPlan, PlanType, PLAN_CONFIG, getDefaultUserPlan } from "@/types/plans";

// Função para gerar chave única por utilizador
const getStorageKey = (userId: string | undefined) => {
  if (!userId) return "contos-diarios-user-plan-guest";
  return `contos-diarios-user-plan-${userId}`;
};

export const usePlanState = (userId?: string) => {
  const STORAGE_KEY = getStorageKey(userId);

  const [userPlan, setUserPlan] = useState<UserPlan>(() => {
    if (typeof window === "undefined") return getDefaultUserPlan();
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserPlan;
        return checkAndResetMonthly(parsed);
      } catch {
        return getDefaultUserPlan();
      }
    }
    return getDefaultUserPlan();
  });

  // Persist to localStorage whenever userPlan changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userPlan));
    }
  }, [userPlan, STORAGE_KEY, userId]);

  // Check if we need to reset monthly counter
  const checkMonthlyReset = useCallback(() => {
    setUserPlan((prev) => checkAndResetMonthly(prev));
  }, []);

  // Run monthly check on mount and periodically
  useEffect(() => {
    checkMonthlyReset();
    const interval = setInterval(checkMonthlyReset, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkMonthlyReset]);

  // Upgrade to premium
  const upgradeToPremium = useCallback(() => {
    setUserPlan((prev) => ({
      ...prev,
      type: "PREMIUM",
    }));
  }, []);

  // Downgrade to free (for testing or subscription end)
  const downgradeToFree = useCallback(() => {
    setUserPlan((prev) => ({
      ...prev,
      type: "FREE",
      thirtyDayMode: undefined, // Disable 30-day mode
    }));
  }, []);

  // Increment story count
  const incrementStoryCount = useCallback(() => {
    setUserPlan((prev) => ({
      ...prev,
      storiesGeneratedThisMonth: prev.storiesGeneratedThisMonth + 1,
    }));
  }, []);

  // Check if user can generate more stories
  const canGenerateStory = useCallback(() => {
    const config = PLAN_CONFIG[userPlan.type];
    return userPlan.storiesGeneratedThisMonth < config.maxStoriesPerMonth;
  }, [userPlan]);

  // Get remaining stories for free plan
  const getRemainingStories = useCallback(() => {
    if (userPlan.type === "PREMIUM") return Infinity;
    return Math.max(0, PLAN_CONFIG.FREE.maxStoriesPerMonth - userPlan.storiesGeneratedThisMonth);
  }, [userPlan]);

  // Check if erotic content is allowed
  const canAccessEroticContent = useCallback(() => {
    return PLAN_CONFIG[userPlan.type].allowEroticContent;
  }, [userPlan.type]);

  // Check if 30-day mode is available
  const canAccessThirtyDayMode = useCallback(() => {
    return PLAN_CONFIG[userPlan.type].allowThirtyDayMode;
  }, [userPlan.type]);

  // Check if user is premium
  const isPremium = userPlan.type === "PREMIUM";

  return {
    userPlan,
    isPremium,
    canGenerateStory,
    getRemainingStories,
    canAccessEroticContent,
    canAccessThirtyDayMode,
    incrementStoryCount,
    upgradeToPremium,
    downgradeToFree,
    setUserPlan,
  };
};

// Helper function to check and reset monthly counter
function checkAndResetMonthly(plan: UserPlan): UserPlan {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const lastResetMonth = plan.lastResetDate.slice(0, 7);

  if (currentMonth !== lastResetMonth) {
    return {
      ...plan,
      storiesGeneratedThisMonth: 0,
      lastResetDate: new Date().toISOString().split("T")[0],
    };
  }
  return plan;
}

export default usePlanState;
