export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    currCalGoal: number;
    ProgressPictures: string[];
};
export type logType = {
    _id: string;
    goalCal: number;
    currCal: number;
    logItems: { name: string; calories: number }[];
    logDate: string;
    journalEntry: string;
    weight: number;
    userId: string;
};