import dotenv from 'dotenv'

dotenv.config({path: '.env.example'})

type IEnvVars =
    | 'TARGET_NETWORK'
    | 'DEPLOYER'
    | 'NETWORK_GATEWAY'

export function useEnv(key: IEnvVars | IEnvVars[], _default = ''): string {
    if (typeof key === 'string') {
        return process.env[key] ?? _default
    }
    if (typeof key === 'object') {
        for (const s of key) {
            if (process.env[s]) {
                return process.env[s]!
            }
        }
    }
    return _default
}