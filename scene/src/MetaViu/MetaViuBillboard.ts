import {getUserAccount} from '@decentraland/EthereumController'
import {getParcel, ILand} from "@decentraland/ParcelIdentity";

@EventConstructor()
export class MetaViuBillboardEvent {
    constructor(public type:string, public data:any) {}
}


export default class MetaViuBillboard {
    private videoTexture: any;
    private rotation: any;
    /*Your nft id here
    billboard_id = YOUR_NFT_ID
    Default is 7777 */
    private type:string="Double"
    private billboard_id = 7777;
    private redirect_url:string[] = [];
    private gltfShape:string=""

    listeners:EventManager[]=[]

    constructor(type:string="Double", id:number=7777, listener?:EventManager) {
        if (listener) {
            this.listeners.push(listener)
        }
        this.billboard_id=id
        this.type = type
        this.fireEvents("LOADED")
        switch (this.type.toLowerCase()) {
            case "double":
            case "doubletest":
                this.gltfShape = 'models/MetaViu/MetaViuDouble.glb'
                break
            case "triple":
            case "tripletest":
                this.gltfShape = 'models/MetaViu/MetaViuTriple.glb'
                break
            case "quadruple":
            case "quadrupletest":
                this.gltfShape = 'models/MetaViu/MetaViuQuadruple.glb'
                break
            case "panel":
            case "paneltest":
                    this.gltfShape = 'models/MetaViu/MetaViuPanel.glb'
                break
            default:
                log("MetaViuBillboards error: unknown type ("+this.type+")")
        }
    }

    fireEvents(type:string, vidPlaying?:boolean) { // CF added
        for (let listener of this.listeners) {
            listener.fireEvent(new MetaViuBillboardEvent(
              type,
              (vidPlaying != undefined)?
              {
                type:this.type,
                id:this.billboard_id,
                vidPlaying:vidPlaying
              }:
              {
                type:this.type,
                id:this.billboard_id
              }
            ))
        }
    }

    init() {
    }

    spawn(host: Entity, channel: any) { //todo cf the 2nd param here was of type IChannel, which is unknown here, so it was changed to type any
        const sign = new Entity()
        sign.setParent(host)
        this.find_ad(host).then()
        sign.addComponent(new GLTFShape(this.gltfShape))
        sign.addComponent(new Transform({})) // CF commented this out so that host's transform is used.
        sign.addComponent(
            new OnPointerDown(() => {
                    openExternalURL(this.redirect_url[this.billboard_id])
                    this.fireEvents("TOUCHED")
                },
                {
                    hoverText: 'Interact',
                })
        )
    }

    render_content(host: Entity, url:string, side:string, transform: Transform, type:string) {
        let QRMaterial = new Material()
        QRMaterial.metallic = 0
        QRMaterial.roughness = 1
        QRMaterial.specularIntensity = 0
        if (type != 'image') {
            this.videoTexture = new VideoTexture(new VideoClip(
                url
            ))
            QRMaterial.albedoTexture = this.videoTexture
        } else {
            QRMaterial.albedoTexture = new Texture(url)
        }

        let variable = new Entity()
        variable.setParent(host)
        variable.addComponent(new PlaneShape())
        variable.addComponent(QRMaterial)
        variable.addComponent(
            transform
        )
        if (type != 'image') {
            variable.addComponent(
                new OnPointerDown(() => {
                    this.videoTexture.playing = !this.videoTexture.playing
                    this.fireEvents("VIDEO_TOUCHED",this.videoTexture.playing)
                })
            )
            this.videoTexture.loop = true;
            this.videoTexture.play()
        }
        else {
            variable.addComponent(
                new OnPointerDown(() => {
                        openExternalURL(this.redirect_url[this.billboard_id])
                        this.fireEvents("TOUCHED")
                    },
                    {
                        hoverText: 'Interact',
                    })
            )
        }

    }

    async find_ad(host: Entity) {
        const userAccount = await getUserAccount()
        const parcel = await getParcel()
        const transform = host.getComponent(Transform)

        let request = {
            width: transform.scale.x,
            height: transform.scale.y,
            billboard_type: this.type,
            billboard_id: this.billboard_id,
            type: ['image', 'video'],
            mime_type: ['image/jpeg', 'image/png', 'video/mp4'],
            context: {
                site: {
                    url: 'https://' + this.getSceneId(parcel.land) + '.decentraland.org/',
                },
                user: {
                    account: userAccount,
                },
            },
            vendor: 'Decentraland',
            version: '1.1',
        }

        let response: any = {}

        let test:boolean = this.type.toLowerCase().substr(this.type.length-4) == "test" // CF added


        try {
            if (!test) {
                let callUrl = 'https://billboards-api.metaviu.io/show_ad'
                let callResponse = await fetch(callUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
    
                    },
                    method: 'POST',
                    body: JSON.stringify(request),
                })
                response = await callResponse.json();
            }

            let testContentUrl:string = "https://extraterra-files.nyc3.cdn.digitaloceanspaces.com/files/test/TestPattern.jpg"// CF added
            this.redirect_url[this.billboard_id] = test?"https://dclconf.com":response.redirect_url;

            switch (this.type.toLowerCase()) {
                case "panel":
                case "paneltest":
                    // this.redirect_url[this.billboard_id] = test?"https://dclconf.com":response.redirect_url;
                    this.rotation = (test || response.content.side_1.type == 'image') ? Quaternion.Euler(180, 90, 0) : new Quaternion(0, 1.0, 0, 1);
                    let position = (test || response.content.side_1.type == 'image') ?  new Vector3(0.08, 0.424, 0.3) :  new Vector3(-0.08, 0.424, 0.3);
                    this.render_content(host, test?testContentUrl:response.content.side_1.url, 'side1', new Transform({
                        position: position,
                        rotation: this.rotation,
                        scale: new Vector3(5.1, 2.9, 4)
                    }), test?'image':response.content.side_1.type)

                    this.rotation = (test || response.content.side_1.type == 'image') ? Quaternion.Euler(180, 270, 0) : new Quaternion(0, 1.0, 0, 1);
                    position = (test || response.content.side_1.type == 'image') ?  new Vector3(-0.08, 0.424, 0.3) :  new Vector3(0.08, 0.424, 0.3);
                    this.render_content(host, test?testContentUrl:response.content.side_2.url, 'side2', new Transform({
                        position: position,
                        rotation: this.rotation,
                        scale: new Vector3(5.1, 2.9, 4)
                    }), test?'image':response.content.side_2.type)
                    break

                case "double":
                case "doubletest":
                    // this.redirect_url[this.billboard_id] = test?"https://dclconf.com":response.redirect_url;
                    this.rotation = (test || response.content.side_1.type == 'image') ? Quaternion.Euler(180, 90, 0) : new Quaternion(0, 1.0, 0, 1);
                    this.render_content(host, test?testContentUrl:response.content.side_1.url, 'side1', new Transform({
                        position: new Vector3(0.05, 4.8, 0.3),
                        rotation: this.rotation,
                        scale: new Vector3(5.1, 2.9, 4)
                    }), test?'image':response.content.side_1.type)
        
                    this.rotation = (test || response.content.side_2.type == 'image') ? Quaternion.Euler(180, 270, 0) : new Quaternion(0, -1, 0, 1);
                    this.render_content(host, test?testContentUrl:response.content.side_2.url, 'side2', new Transform({
                        position: new Vector3(-0.05, 4.8, 0.3),
                        rotation: this.rotation,
                        scale: new Vector3(5.1, 2.9, 4)
                    }), test?'image':response.content.side_2.type);                    
                    break

                case "triple":
                case "tripletest":
                    // this.redirect_url[this.billboard_id] = test?"https://dclconf.com":response.redirect_url;

                    this.rotation = (test || response.content.side_1.type == 'image') ? Quaternion.Euler(180, 78.65, 0) : Quaternion.Euler(360, 78.65, 0);
                    this.render_content(host, test?testContentUrl:response.content.side_1.url, 'side1', new Transform({
                        position: new Vector3(2.837, 4.04, 0.34),
                        rotation: this.rotation,
                        scale: new Vector3(3.54, 2.5, 2)
                    }), test?'image':response.content.side_1.type)
        
                    this.rotation = (test || response.content.side_2.type == 'image') ?Quaternion.Euler(180, -41.35, 0) : Quaternion.Euler(360, -41.35, 0);
                    this.render_content(host, test?testContentUrl:response.content.side_2.url, 'side2', new Transform({
                        position: new Vector3(1.152, 4.04, 0.89),
                        rotation: this.rotation,
                        scale: new Vector3(3.54, 2.5, 2)
                    }), test?'image':response.content.side_2.type);
        
                    this.rotation = (test || response.content.side_2.type == 'image') ? Quaternion.Euler(180, 198.66, 0) : Quaternion.Euler(360, 198.66, 0);
                    this.render_content(host, test?testContentUrl:response.content.side_3.url, 'side3', new Transform({
                        position: new Vector3(1.5, 4.04, -0.846),
                        rotation: this.rotation,
                        scale: new Vector3(3.54, 2.5, 2)
                    }), test?'image':response.content.side_3.type);                    
                    break
                case "quadruple":
                case "quadrupletest":
                    // this.redirect_url[this.billboard_id] = test?"https://dclconf.com":response.redirect_url;
                    this.rotation = (test || response.content.side_1.type == 'image') ?  Quaternion.Euler(180, 90, 0):  Quaternion.Euler(360, 90, 0);
                    this.render_content(host, test?testContentUrl:response.content.side_1.url, 'side1', new Transform({
                        position: new Vector3(3.5, 4.15, 0.14),
                        rotation: this.rotation,
                        scale: new Vector3(3.2, 2.5, 2)
                    }), test?'image':response.content.side_1.type)

                    this.rotation = (test || response.content.side_2.type == 'image') ? Quaternion.Euler(180, -90, 0):   Quaternion.Euler(360, 270, 0);
                    this.render_content(host, test?testContentUrl:response.content.side_2.url, 'side2', new Transform({
                        position: new Vector3(0.18, 4.15, 0.13),
                        rotation: this.rotation,
                        scale: new Vector3(3.2, 2.5, 2)
                    }), test?'image':response.content.side_2.type);

                    this.rotation = (test || response.content.side_3.type == 'image') ? Quaternion.Euler(180, 360, 0) :  Quaternion.Euler(360, 360, 0);
                    this.render_content(host, test?testContentUrl:response.content.side_3.url, 'side3', new Transform({
                        position: new Vector3(1.83, 4.15, 1.79),
                        rotation: this.rotation,
                        scale: new Vector3(3.2, 2.5, 2)
                    }), test?'image':response.content.side_3.type);

                    this.rotation = (test || response.content.side_4.type == 'image') ? Quaternion.Euler(180, 180, 0) : Quaternion.Euler(360, 180, 0);
                    this.render_content(host, test?testContentUrl:response.content.side_4.url, 'side4', new Transform({
                        position: new Vector3(1.83, 4.15, -1.53),
                        rotation: this.rotation,
                        scale: new Vector3(3.2, 2.5, 2)
                    }), test?'image':response.content.side_4.type);
                    break
                default:
                    log("MetaViuBillboards error: unknown type ("+this.type+")")
            }
            

        } catch (e) {
            log('failed to reach URL', e)
        }

    }


    getSceneId(land: ILand): string {
        return 'scene-' +
            land.sceneJsonData.scene.base.replace(new RegExp('-', 'g'), 'n')
                .replace(',', '-')
    }
}