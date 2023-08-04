// Decentraland's methods
import * as utils from '@dcl/ecs-scene-utils'
import { getUserData, UserData } from '@decentraland/Identity'
import { getParcel } from '@decentraland/ParcelIdentity'
import { isPreviewMode } from '@decentraland/EnvironmentAPI'
// MetaAds files
import * as metaAdsUtils from './metaAdsUtils'
import { metaAdsEnvironment } from './metaAdsEnvironment'

export class metaAds {
  // NB: these params will be the same for all screens
  metaAdsUserId = parseInt(metaAdsEnvironment.userId)
  metaAdsUserSignature = metaAdsEnvironment.userSignature
  metaAdsBaseUrl = metaAdsEnvironment.baseUrl
  metaAdsInterval = metaAdsEnvironment.intervalBetweenRequests
  metaAdsUrl = metaAdsEnvironment.streamUrl
  metaAdsIntervalForMetrics = metaAdsEnvironment.intervalForMetrics
  metaAdsIntervalForSendMetrics = metaAdsEnvironment.intervalForSendMetrics
  intervalForPixelMetrics = metaAdsEnvironment.intervalForPixelMetrics
  intervalForUpdatePixelToken = metaAdsEnvironment.intervalForUpdatePixelToken
  metaAdsHeartBeatUrl = `${this.metaAdsBaseUrl}/hb/heart-beat`
  metaAdsUrlExternalLink = `${this.metaAdsBaseUrl}/tornado/adspot/click-on-external-link`
  n: number

  // these params are calculated below
  metaAdsMaterials: Material[] = []
  metaAdsScreens: Entity[] = []
  metaAdsCoordsOfDisplays: string[] = []

  metaAdsVideoTextures: VideoTexture[] = []
  metaAdsUpdateDates: Array<null | Date> = []
  metaAdsAdSpotSessionsIds: number[] = []
  metaAdsAdSpotCreativesIds: number[] = []
  metaAdsTokens: string[] = []
  metaAdsScreensMetrics: metaAdsUtils.metricsComponent[] = []
  metaAdsHeartBeatTokens: Array<null | string> = []
  metaAdsVideoRotations: Quaternion[] = []
  metaAdsPinRotations: Quaternion[] = []
  metaAdsExternalLinks: Array<null | string> = []

  // metrics
  metaAdsUserData: UserData | null = null

  metaAdsChecker = new Entity()
  metaAdsMetricsCollector = new Entity()
  metaAdsMetricsSender = new Entity()

  // pixel
  pixelSender = new Entity()
  pixelTokenUpdater = new Entity()
  isPlayerOnScene = true
  width: number | null = null // x
  height: number | null = null // y
  length: number | null = null // z
  isPreview: boolean | null = null
  baseParcel = ''
  pixelUrl = metaAdsEnvironment.pixelUrl
  pixelHBToken: string | null = null
  heartBeatPixelUrl = `${this.metaAdsBaseUrl}/hb/heart-beat-pixel`
  realAdSpotsPositions: Vector3[] = []

  constructor (
    public metaAdsPositions: Vector3[],
    public metaAdsImageRotations: Quaternion[],
    public metaAdsScales: Vector3[],
    public metaAdsPins: number[],
    public metaAdsParentEntities: Array<Entity | null>
  ) {
    this.n = metaAdsPositions.length
    if (
      metaAdsPositions.length !== metaAdsImageRotations.length ||
      metaAdsImageRotations.length !== metaAdsScales.length ||
      metaAdsScales.length !== metaAdsPins.length ||
      metaAdsPins.length !== metaAdsParentEntities.length
    ) {
      const canvas = new UICanvas()
      const text = new UIText(canvas)
      text.fontSize = 36
      text.value = 'Check MetaAds display parameters,\ntheir number should be equaled\nFix it and reload the scene'
      return
    }
    for (let i = 0; i < this.n; i++) {
      this.metaAdsMaterials.push(metaAdsUtils.createMaterial())
      this.metaAdsScreens.push(
        metaAdsUtils.createScreen(
          metaAdsScales[i],
          metaAdsPositions[i],
          metaAdsImageRotations[i],
          metaAdsParentEntities[i]
        )
      )
      this.metaAdsCoordsOfDisplays.push(
        metaAdsUtils.formPositionString(metaAdsPositions[i])
      )
      this.metaAdsVideoRotations.push(
        Quaternion.Euler(
          (metaAdsImageRotations[i].eulerAngles.x + 180) % 360,
          metaAdsImageRotations[i].eulerAngles.y,
          metaAdsImageRotations[i].eulerAngles.z
        )
      )
      this.metaAdsPinRotations.push(
        Quaternion.Euler(
          (metaAdsImageRotations[i].eulerAngles.x + 180) % 360,
          (metaAdsImageRotations[i].eulerAngles.y + 180) % 360,
          metaAdsImageRotations[i].eulerAngles.z
        )
      )
      this.metaAdsUpdateDates[i] = null
      this.metaAdsAdSpotSessionsIds[i] = 0
      this.metaAdsAdSpotCreativesIds[i] = 0
      this.metaAdsTokens[i] = ''
      this.metaAdsScreensMetrics[i] = this.metaAdsScreens[i].getComponentOrCreate(metaAdsUtils.metricsComponent)
      this.metaAdsHeartBeatTokens[i] = null
      this.metaAdsExternalLinks[i] = null
      this.realAdSpotsPositions.push(
        metaAdsUtils.getRealPos(this.metaAdsScreens[i])
      )
    }
    // click event
    for (let i = 0; i < this.n; i++) {
      this.metaAdsScreens[i].addComponent(
        new OnPointerDown(() => {
          const externalLink = this.metaAdsExternalLinks[i]
          if (externalLink !== null) {
            this.metaAdsScreensMetrics[i].clicked = true
            openExternalURL(externalLink)
            executeTask(async () => {
              await this.sendClick(i)
            }).then(
              () => {},
              () => {}
            )
          }
        },
        {
          distance: 32
        })
      )
    }

    // emote event
    onPlayerExpressionObservable.add(({ expressionId }) => {
      const num = metaAdsUtils.predefinedEmote[expressionId] ?? 100
      for (let i = 0; i < this.n; i++) {
        this.metaAdsScreensMetrics[i].reacted = num
      }
    })

    // collect user data
    executeTask(async () => {
      this.metaAdsUserData = await getUserData()
    }).then(
      () => {},
      () => {}
    )

    // check if DCL runs locally
    executeTask(async () => {
      if (this.isPreview === null || this.isPreview === undefined) {
        this.isPreview = await isPreviewMode()
      }
    }).then(
      () => {},
      () => {}
    )

    this.metaAdsChecker.addComponent(
      new utils.Interval(this.metaAdsInterval, () => {
        const now = new Date()
        for (let i = 0; i < this.n; i++) {
          const metaAdsUpdateDate = this.metaAdsUpdateDates[i]
          if (metaAdsUpdateDate === null || metaAdsUpdateDate < now) {
            executeTask(async () => {
              await this.metaAdsGetData(i)
            }).then(
              () => {},
              () => {}
            )
          }
        }
      })
    )

    // collect metrics
    this.metaAdsMetricsCollector.addComponent(
      new utils.Interval(this.metaAdsIntervalForMetrics, () => {
        for (let i = 0; i < this.n; i++) {
          this.metaAdsCollectMetrics(i)
        }
      })
    )

    // sending metrics
    this.metaAdsMetricsSender.addComponent(
      new utils.Interval(this.metaAdsIntervalForSendMetrics, () => {
        executeTask(async () => {
          for (let i = 0; i < this.n; i++) {
            // if token for heart-beat service has NOT already come or pin is shown,
            // request will NOT send, but metrics are collected always
            if (
              this.metaAdsHeartBeatTokens[i] !== null &&
              this.metaAdsHeartBeatTokens[i] !== undefined &&
              this.metaAdsScreens[i].getComponent(PlaneShape).visible
            ) {
              await this.metaAdsSendMetrics(i)
            }
          }
        }).then(
          () => {},
          () => {}
        )
      })
    )

    // Compute scene info
    executeTask(async () => {
      await this.getSceneInfo()
    }).then(
      () => {},
      () => {}
    )

    // the first request to get pixel token runs
    // after 5 sec from scene starts
    // due to 'isPreviewMode()' runs long
    this.pixelTokenUpdater.addComponent(
      new utils.Delay(5000, () => {
        // Token is forming when user stands on the scene
        // and scene doesn't run locally
        executeTask(async () => {
          if (
            this.isPlayerOnScene && this.isPreview === false &&
            (this.pixelHBToken === null || this.pixelHBToken === undefined)
          ) {
            await this.getPixelAuthToken()
          }
        }).then(
          () => {},
          () => {}
        )
      })
    )

    // collect and send player coords for pixel
    // Event when player enters scene
    onEnterSceneObservable.add((_) => {
      this.isPlayerOnScene = true
      // Compute scene info
      executeTask(async () => {
        await this.getSceneInfo()
      }).then(
        () => {},
        () => {}
      )
    })

    // Event when player leaves scene
    onLeaveSceneObservable.add((_) => {
      this.isPlayerOnScene = false
    })

    // Form token for pixel
    this.pixelTokenUpdater.addComponent(
      new utils.Interval(this.intervalForUpdatePixelToken, () => {
        executeTask(async () => {
          if (
            this.isPlayerOnScene && this.isPreview === false &&
            (this.pixelHBToken === null || this.pixelHBToken === undefined)
          ) {
            await this.getPixelAuthToken()
          }
        }).then(
          () => {},
          () => {}
        )
      })
    )

    this.pixelSender.addComponent(
      new utils.Interval(this.intervalForPixelMetrics, () => {
        executeTask(async () => {
          if (
            this.isPlayerOnScene && this.isPreview === false &&
            this.pixelHBToken !== null && this.pixelHBToken !== undefined
          ) {
            await this.sendPixel()
          }
        }).then(
          () => {},
          () => {}
        )
      })
    )

    engine.addEntity(this.pixelTokenUpdater)
    engine.addEntity(this.pixelSender)

    engine.addEntity(this.metaAdsMetricsCollector)
    engine.addEntity(this.metaAdsMetricsSender)
    engine.addEntity(this.metaAdsChecker)
    for (let i = 0; i < this.n; i++) {
      engine.addEntity(this.metaAdsScreens[i])
    }
  }

  async metaAdsSendMetrics (index: number): Promise<void> {
    const jsonMetrics = JSON.stringify(this.metaAdsScreensMetrics[index])
    const result = await metaAdsUtils.sendMetrics(
      this.metaAdsHeartBeatUrl,
      this.metaAdsHeartBeatTokens[index] ?? '',
      jsonMetrics
    )
    // Heart-Beat has not received data,
    // so needs to refresh its token
    if (!result) {
      await this.metaAdsRefreshHeartBeatToken(this.metaAdsUrl, this.metaAdsTokens[index], index)
    }
    // empty old metrics
    this.metaAdsScreens[index].removeComponent(metaAdsUtils.metricsComponent)
    this.metaAdsScreensMetrics[index] = this.metaAdsScreens[index].getComponentOrCreate(metaAdsUtils.metricsComponent)
  }

  metaAdsCheckFocusing (): void {
    const physicsCast = PhysicsCast.instance
    const rayFromCamera = physicsCast.getRayFromCamera(1000)

    physicsCast.hitFirst(
      rayFromCamera,
      (e) => {
        if (e.didHit) {
          for (let i = 0; i < this.n; i++) {
            if (engine.entities[e.entity.entityId] === this.metaAdsScreens[i]) {
              this.metaAdsScreensMetrics[i].focused = true
              // user can look on one display only
              break
            }
          }
        }
      }
    )
  }

  metaAdsCollectMetrics (index: number): void {
    // NB: if have been several emotes, will be collected the last only
    // NB: if have been one at least focusing in intervalForMetrics, focused will be true

    // watchings
    this.metaAdsCheckFocusing()
    // adspot info
    this.metaAdsScreensMetrics[index].pin = this.metaAdsPins[index]
    // playback id
    this.metaAdsScreensMetrics[index].session_id = this.metaAdsAdSpotSessionsIds[index]
    // creative id
    this.metaAdsScreensMetrics[index].creative_id = this.metaAdsAdSpotCreativesIds[index]

    if (this.metaAdsUserData !== null) {
      // user data
      this.metaAdsScreensMetrics[index].user = this.metaAdsUserData.userId
      // web3 connection
      this.metaAdsScreensMetrics[index].web3 = this.metaAdsUserData.hasConnectedWeb3
      // public key
      this.metaAdsScreensMetrics[index].public_key = this.metaAdsUserData.publicKey
    }
  }

  async metaAdsRefreshHeartBeatToken (apiUrl: string, apiToken: string, index: number): Promise<void> {
    const apiResponse = await metaAdsUtils.sendSignedRequest(apiUrl, apiToken)
    this.metaAdsHeartBeatTokens[index] = apiResponse?.json.token ?? null
  }

  // display
  metaAdsCreateDisplay (stream: any, index: number): void {
    let rotation = new Quaternion()
    const transform = this.metaAdsScreens[index].getComponent(Transform)
    const currentPosition = transform.position
    const currentScale = transform.scale
    if (stream.pin !== undefined) {
      if (this.metaAdsScreens[index].getComponent(PlaneShape).visible) {
        this.metaAdsScreens[index].getComponent(PlaneShape).visible = false
      }
      this.metaAdsScreens[index].addComponentOrReplace(metaAdsUtils.createTextShape(stream.pin))
      rotation = this.metaAdsPinRotations[index]
    } else {
      this.metaAdsScreens[index].getComponentOrCreate(TextShape).value = ''
      if (!this.metaAdsScreens[index].getComponent(PlaneShape).visible) {
        this.metaAdsScreens[index].getComponent(PlaneShape).visible = true
      }
    }
    // stop played video
    if (this.metaAdsVideoTextures[index]?.playing) {
      this.metaAdsVideoTextures[index].pause()
    }
    // image
    if (stream.is_image === true) {
      this.metaAdsMaterials[index].albedoTexture = new Texture(stream.url)
      rotation = this.metaAdsImageRotations[index]
    }
    // video
    if (stream.is_image === false) {
      this.metaAdsVideoTextures[index] = new VideoTexture(new VideoClip(stream.url))
      this.metaAdsVideoTextures[index].loop = true
      this.metaAdsMaterials[index].albedoTexture = this.metaAdsVideoTextures[index]
      this.metaAdsVideoTextures[index].play()
      rotation = this.metaAdsVideoRotations[index]
    }
    this.metaAdsScreens[index].addComponentOrReplace(
      new Transform({
        scale: currentScale,
        position: currentPosition,
        rotation: rotation
      })
    )
    this.metaAdsScreens[index].addComponentOrReplace(this.metaAdsMaterials[index])
  }

  metaAdsSetDefaultValues (index: number): void {
    this.metaAdsAdSpotCreativesIds[index] = 0
    this.metaAdsAdSpotSessionsIds[index] = 0
    this.metaAdsExternalLinks[index] = null
  }

  async metaAdsGetData (index: number): Promise<void> {
    let json
    const msgContent = JSON.stringify({
      user_id: this.metaAdsUserId,
      pin: this.metaAdsPins[index],
      wallet: this.metaAdsUserData?.publicKey ?? '0x'
    })
    this.metaAdsTokens[index] = metaAdsUtils.formToken(this.metaAdsUserSignature, msgContent)

    this.metaAdsSetDefaultValues(index)

    const response = await metaAdsUtils.sendSignedRequest(this.metaAdsUrl, this.metaAdsTokens[index])
    if (response !== null) {
      const status = response.status
      json = response.json
      // 200
      if (status === 200) {
        this.metaAdsHeartBeatTokens[index] = json.token
        this.metaAdsExternalLinks[index] = json.external_link
        let timeNextRequest = new Date(new Date().getTime() + 4000)
        if (json.url !== undefined) {
          if (json.to_time !== undefined) {
            timeNextRequest = metaAdsUtils.dateWithoutTimezone(json.to_time)
          }
          this.metaAdsUpdateDates[index] = timeNextRequest
          log(`${(json.is_image === true ? 'Image' : 'Video')} was got`)
          this.metaAdsAdSpotSessionsIds[index] = json.session_id
          this.metaAdsAdSpotCreativesIds[index] = json.creative_id
        } else {
          this.metaAdsUpdateDates[index] = timeNextRequest
          json = metaAdsUtils.defaultImageJson
        }
      // not 200
      } else {
        const message = json.msg
        log(message)
        this.metaAdsUpdateDates[index] = null
        json = metaAdsUtils.defaultImageJson
      }
    } else {
      this.metaAdsUpdateDates[index] = null
      json = metaAdsUtils.defaultImageJson
      log('API doesn\'t respond')
    }
    this.metaAdsCreateDisplay(json, index)
  }

  async sendClick (index: number): Promise<void> {
    const response = await metaAdsUtils.sendSignedRequest(this.metaAdsUrlExternalLink, this.metaAdsTokens[index])
    if (response !== null && response.status === 200) {
      log('Click was sent.')
    } else {
      log('Something went wrong. Click was NOT sent.')
    }
  }

  // pixel
  // get base parcel and edge points of the scene
  async getSceneInfo (): Promise<void> {
    const parcel = await getParcel()
    this.baseParcel = parcel.land.sceneJsonData.scene.base
    const sceneSize = metaAdsUtils.getSceneSize(parcel.land.sceneJsonData.scene.parcels)
    this.width = sceneSize.width
    this.height = sceneSize.height
    this.length = sceneSize.length
  }

  // auth token for sending pixel HB
  async getPixelAuthToken (): Promise<void> {
    const msgContent = JSON.stringify({
      user_id: this.metaAdsUserId,
      wallet: this.metaAdsUserData?.publicKey ?? '0x',
      scene_coords: this.baseParcel,
      width: this.width,
      height: this.height,
      length: this.length,
      web3: this.metaAdsUserData?.hasConnectedWeb3 ?? false,
      metaverse: 'Decentraland',
      ad_spots: {
        identifiers: this.metaAdsPins,
        coords: this.realAdSpotsPositions
      }
    })
    const response = await metaAdsUtils.sendSignedRequest(
      this.pixelUrl,
      metaAdsUtils.formToken(this.metaAdsUserSignature, msgContent)
    )
    this.pixelHBToken = response?.json.token ?? null
  }

  async sendPixel (): Promise<void> {
    const playerCoords = Camera.instance.position
    const result = await metaAdsUtils.sendMetrics(
      this.heartBeatPixelUrl,
      this.pixelHBToken ?? '',
      JSON.stringify(playerCoords)
    )
    if (!result) { await this.getPixelAuthToken() }
  }
}
