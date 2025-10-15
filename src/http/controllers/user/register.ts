import { UserAlreadyExist } from '@/use-case/errors/user-already-exist'
import { makeRegisterUseCase } from '@/use-case/factories/make-register-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(req: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { name, email, password } = registerBodySchema.parse(req.body)

    try {
        const useCase = makeRegisterUseCase()

        await useCase.execute({
            name, email, password
        })

    } catch (err) {
        if (err instanceof UserAlreadyExist) {
            return reply.status(409).send({ message: err.message })
        }

        throw err
    }

    return reply.status(201).send()
}