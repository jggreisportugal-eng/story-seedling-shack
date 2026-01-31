import React, { createContext, useContext, ReactNode } from "react";
import { usePlanState } from "@/hooks/usePlanState";
import { UserPlan, PlanType } from "@/types/plans";

interface PlanContextType {
  userPlan: UserPlan;
  isPremium: boolean;
  canGenerateStory: () => boolean;
  getRemainingStories: () => number;
  canAccessEroticContent: () => boolean;
  canAccessThirtyDayMode: () => boolean;
  incrementStoryCount: () => void;
  upgradeToPremium: () => void;
  downgradeToFree: () => void;
  setUserPlan: React.Dispatch<React.SetStateAction<UserPlan>>;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const planState = usePlanState();

  return (
    <PlanContext.Provider value={planState}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
};

export default PlanContext;
