import { FlatFetchResponse, signedFetch } from '@decentraland/SignedFetch'
import { metaAdsEnvironment } from './metaAdsEnvironment'
import * as metaAdsLibs from './metaAdsLibs/init'

const defaultImageJson = {
  is_image: true,
  url: metaAdsEnvironment.defaultImageUrl
}

@Component('metaAdsMetricsComponent')
class metricsComponent {
  focused: boolean
  user: string
  web3: boolean
  pin: number
  reacted: number
  session_id: number
  creative_id: number
  clicked: boolean
  public_key: string | null
  constructor () {
    this.focused = false
    this.user = '0x'
    this.web3 = false
    this.pin = 0
    this.reacted = 0
    this.session_id = 0
    this.creative_id = 0
    this.clicked = false
    this.public_key = null
  }
}

const predefinedEmote: any = {
  'wave': 10,
  'fistpump': 11,
  'robot': 12,
  'raiseHand': 13,
  'clap': 14,
  'money': 15,
  'kiss': 16,
  'tik': 17,
  'hammer': 18,
  'tektonik': 19,
  'dontsee': 20,
  'handsair': 21,
  'shrug': 22,
  'disco': 23,
  'dab': 24,
  'headexplode': 25
}

function dateWithoutTimezone (stringDate: string): Date {
  const date = new Date(stringDate)
  if (date == null) return date
  const timestamp = date.getTime() - date.getTimezoneOffset() * metaAdsEnvironment.timeForContent
  const correctDate = new Date(timestamp)
  return correctDate
}

function createScreen (
  scale: Vector3,
  position: Vector3,
  rotation: Quaternion,
  parentEntity: Entity | null = null
): Entity {
  const screen: Entity = new Entity()
  screen.addComponent(new PlaneShape())
  screen.addComponent(
    new Transform({
      scale: scale,
      position: position,
      rotation: rotation
    })
  )
  if (parentEntity !== null) { screen.setParent(parentEntity) }
  return screen
}

function createMaterial (): Material {
  const material = new Material()
  material.roughness = 1
  material.specularIntensity = 0
  material.metallic = 0
  return material
}

function createTextShape (pin: string = ''): TextShape {
  const textShape = new TextShape(pin)
  textShape.fontSize = 4
  textShape.outlineWidth = 0.075
  textShape.outlineColor = new Color3(0, 0, 0)
  textShape.shadowBlur = 1
  textShape.shadowColor = new Color3(0, 0, 0)
  textShape.shadowOffsetX = 1
  textShape.shadowOffsetY = 1
  return textShape
}

function formToken (
  key: string,
  msgContent: string
): string {
  const headerContent = JSON.stringify(
    {
      typ: 'JWT',
      alg: 'HS256'
    }
  )
  const header: string = metaAdsLibs.btoa(headerContent)
  const msg: string = metaAdsLibs.btoa(msgContent)
  const data: string = `${header}.${msg}`
  const signatureChars: Uint8Array = hmacSha256(key, data)
  const signature: string = metaAdsLibs.btoaFromArr(signatureChars)

  const token: string = `${header}.${msg}.${signature}`
  return token
}

function strToUtf8Bytes (str: string): any {
  const utf8 = []
  for (let ii = 0; ii < str.length; ii++) {
    let charCode = str.charCodeAt(ii)
    if (charCode < 0x80) utf8.push(charCode)
    else if (charCode < 0x800) {
      utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f))
    } else if (charCode < 0xd800 || charCode >= 0xe000) {
      utf8.push(0xe0 | (charCode >> 12), 0x80 | ((charCode >> 6) & 0x3f), 0x80 | (charCode & 0x3f))
    } else {
      ii++
      charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(ii) & 0x3ff))
      utf8.push(
        0xf0 | (charCode >> 18),
        0x80 | ((charCode >> 12) & 0x3f),
        0x80 | ((charCode >> 6) & 0x3f),
        0x80 | (charCode & 0x3f)
      )
    }
  }
  return utf8
}

function hmacSha256 (key: string, data: string): Uint8Array {
  const myHmac: Uint8Array = metaAdsLibs.hmac(
    Uint8Array.from(strToUtf8Bytes(key)),
    Uint8Array.from(strToUtf8Bytes(data))
  )
  return myHmac
}

function formPositionString (position: Vector3): string {
  return position.toString().replace(/\s+/g, '').replace('(', '').replace(')', '')
}

function encodeJsonMetrics (jsonMetrics: string): string {
  return metaAdsLibs.btoa(jsonMetrics)
}

async function sendSignedRequest (url: string, token: string): Promise<FlatFetchResponse | null> {
  try {
    const response = await signedFetch(url, {
      headers: {
        Authorization: token,
        Signed: 'true'
      },
      method: 'GET'
    })
    if (response.json === undefined) {
      response.json = JSON.parse(response.text ?? '{}')
    }
    return response
  } catch {
    return null
  }
}

async function sendMetrics (
  url: string, token: string, jsonMetrics: string
): Promise<boolean> {
  const encodedJsonMetrics = encodeJsonMetrics(jsonMetrics)
  const response = await fetch(
    url, {
      method: 'HEAD',
      headers: {
        Authorization: token,
        Metrics: encodedJsonMetrics
      }
    }
  )

  // refresh heart-beat token
  if (response.status === 401) {
    return false
  }
  return true
}

function getSceneSize (parcelsInfo: string[]): { width: number, height: number, length: number } {
  const x: number[] = []
  const z: number[] = []
  for (const rawParcel of parcelsInfo) {
    const point = rawParcel.split(',').map(p => parseInt(p))
    x.push(point[0])
    z.push(point[1])
  }
  const width = Math.max(...x) - Math.min(...x) + 1
  const length = Math.max(...z) - Math.min(...z) + 1
  const height = Math.ceil(20 * Math.log(parcelsInfo.length + 1) / Math.log(2))
  return {
    width: width * 16,
    height: height,
    length: length * 16
  }
}

function getRealPos (entity: Entity): Vector3 {
  const entityPosition = entity.getComponent(Transform).position
  const position = new Vector3(entityPosition.x, entityPosition.y, entityPosition.z)
  let parentEntity = entity.getParent()
  while (parentEntity !== null) {
    const transform = parentEntity.getComponentOrNull(Transform)
    if (transform === null) { break }
    const parentPosition = transform.position
    position.x += parentPosition.x
    position.y += parentPosition.y
    position.z += parentPosition.z
    parentEntity = parentEntity.getParent()
  }
  return position
}

export {
  defaultImageJson,
  predefinedEmote,
  dateWithoutTimezone,
  formToken,
  formPositionString,
  createTextShape,
  createMaterial,
  createScreen,
  encodeJsonMetrics,
  sendSignedRequest,
  sendMetrics,
  metricsComponent,
  getSceneSize,
  getRealPos
}
