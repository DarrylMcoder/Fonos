import path from 'path'
import logger from '@fonos/logger'
import grpc from 'grpc'
import StorageServer, {
  IStorageServer,
  StorageService
} from './storage/storage'

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'dev') {
  const env = path.join(__dirname, '..', '..', '..', '..', '.env')
  require('dotenv').config({ path: env })
}

async function main () {
  //if (!accessExist()) {
  //  logger.log('info', `No access file found. Creating access file`)
  //  await createAccessFile()
  //}

  const server = new grpc.Server()
  const endpoint = process.env.BINDADDR || '0.0.0.0:50052'
  server.addService<IStorageServer>(StorageService, new StorageServer())
  server.bind(endpoint, grpc.ServerCredentials.createInsecure())
  server.start()

  logger.log(
    'info',
    `Fonos APIServer is online @ ${endpoint} (API version = v1alpha1)`
  )
}

main()