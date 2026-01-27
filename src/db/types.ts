export type TierStep = {
    title : string;
    coins : number;
}

export type TierWiseSteps = {
    [tier: number]: TierStep[]
}

export type MaxPerTaskTierWise = {
    [tier: number] : number;
}