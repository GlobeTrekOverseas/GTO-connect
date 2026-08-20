import * as zod from "zod";

export const ApplicationStatus = zod.enum([
  "draft",
  "submitted",
  "under_review",
  "accepted",
  "rejected",
]);

export const CreateApplicationBody = zod.object({
  universityName: zod.string().min(1),
  country: zod.string().min(1),
});

export const ApplicationSchema = zod.object({
  id: zod.number(),
  userId: zod.number(),
  universityName: zod.string(),
  country: zod.string(),
  status: ApplicationStatus,
  createdAt: zod.string(),
  updatedAt: zod.string(),
});

export const CreateApplicationResponse = ApplicationSchema;
export const GetApplicationsResponse = zod.array(ApplicationSchema);
