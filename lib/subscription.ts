import { prisma } from './prisma'

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (!subscription) return false

  return (
    subscription.status === 'active' &&
    subscription.stripeCurrentPeriodEnd > new Date()
  )
}

export async function canGenerateApp(userId: string, projectId?: string): Promise<{
  canGenerate: boolean
  reason?: string
  requiresPayment: boolean
}> {
  // Check if user has active subscription
  const hasSubscription = await hasActiveSubscription(userId)
  
  if (hasSubscription) {
    return { canGenerate: true, requiresPayment: false }
  }

  // If project ID provided, check if that specific project is paid
  if (projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { isPaid: true, userId: true },
    })

    if (!project) {
      return {
        canGenerate: false,
        reason: 'Project not found',
        requiresPayment: false,
      }
    }

    if (project.userId !== userId) {
      return {
        canGenerate: false,
        reason: 'Unauthorized',
        requiresPayment: false,
      }
    }

    if (project.isPaid) {
      return { canGenerate: true, requiresPayment: false }
    }
  }

  return {
    canGenerate: false,
    reason: 'Payment required',
    requiresPayment: true,
  }
}

export async function getUserSubscriptionStatus(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (!subscription) {
    return {
      hasSubscription: false,
      plan: null,
      status: null,
      currentPeriodEnd: null,
    }
  }

  return {
    hasSubscription: true,
    plan: subscription.plan,
    status: subscription.status,
    currentPeriodEnd: subscription.stripeCurrentPeriodEnd,
    isActive: subscription.status === 'active' && subscription.stripeCurrentPeriodEnd > new Date(),
  }
}
