//import * as utils from '@dcl/ecs-scene-utils';
import { Entity, GltfContainer, Transform, engine, pointerEventsSystem,InputAction  } from '@dcl/sdk/ecs';
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math';
import { movePlayerTo,openExternalUrl } from '~system/RestrictedActions'
import { CONFIG, SCENE_TYPE_GAMIMALL, SCENE_TYPE_UNIFIED_SCENE } from './config';
import { log } from './back-ports/backPorts';
import { TransformSafeWrapper } from './back-ports/workarounds';
//import VLM from 'vlm-dcl'

const CLASSNAME = "scene.ts"
//
// Most of the code on this file have been generated through Decentraland Builder.
// https://builder.decentraland.org/
//
let _scene:Entity
    
let alreadyInit = false
export function initStatic():Entity{
    const METHOD_NAME = "initStatic()"

    if(alreadyInit && _scene) return _scene

    alreadyInit = true
    
    _scene = engine.addEntity()
    
    switch(CONFIG.SCENE_TYPE){
      case SCENE_TYPE_GAMIMALL:
        initGamiMallScene(_scene)
        break;
      case SCENE_TYPE_UNIFIED_SCENE:
        initUnifiedScene(_scene)
        break;
    }

    return _scene
}

function initUnifiedScene(_scene:Entity){
  const METHOD_NAME = "initUnifiedScene()"
  log(CLASSNAME,METHOD_NAME,"ENTRY")
}

function initGamiMallScene(_scene:Entity){
  const METHOD_NAME = "initGamiMallScene()"
  log(CLASSNAME,METHOD_NAME,"ENTRY")
  try{
    
    TransformSafeWrapper.create(_scene,{
        position: Vector3.create(5 * 16, 0, 0), //-6*16
        //rotation: new Quaternion(0, 0, 0, 1),
        rotation: Quaternion.fromEulerDegrees(0, -90, 0),
        scale: Vector3.create(1, 1, 1),
    });

    //making main model
    const main = engine.addEntity()
    TransformSafeWrapper.create(main,{
        position: Vector3.create(48, 0, 40),
        rotation: Quaternion.create(0, 0, 0, 1),
        scale: Vector3.create(1, 1, 1),
        parent: _scene
    }); 

    GltfContainer.create(main,{
        src:"models/mains/main.glb"
    })
/*
     //making paintings model
     const paintings = engine.addEntity()
     TransformSafeWrapper.create(paintings,{
         position: Vector3.create(48, 0, 40),
         rotation: Quaternion.create(0, 0, 0, 1),
         scale: Vector3.create(1, 1, 1),
         parent: _scene
     }); 
 
     GltfContainer.create(paintings,{
         src:"models/mains/paintings.glb"
     })
*/
    //Making VLM
    /*try{
      VLM.init() 
    }catch(e){
      log(CLASSNAME,METHOD_NAME,"VLM.init() FAILED",e)
      log(CLASSNAME,METHOD_NAME,"VLM.init() FAILED",e)
    }*/
/* 
     //making adsshop model
     const adsshop = engine.addEntity()
     TransformSafeWrapper.create(adsshop,{
         position: Vector3.create(48, 0, 40),
         rotation: Quaternion.create(0, 0, 0, 1),
         scale: Vector3.create(1, 1, 1),
         parent: _scene
     }); 
 
     GltfContainer.create(adsshop,{
         src:"models/mains/adsshops.glb"
     })*/
       //making ExchangeCenter model
        const ExchangeCenter = engine.addEntity()
        TransformSafeWrapper.create(ExchangeCenter,{
            position: Vector3.create(48, 0, 40),
            rotation: Quaternion.create(0, 0, 0, 1),
            scale: Vector3.create(1, 1, 1),
            parent: _scene
        }); 
    
        GltfContainer.create(ExchangeCenter,{
            src:"models/mains/ExchangeCenter.glb"
        })

        
         //making Plant model
         const plants = engine.addEntity()
         TransformSafeWrapper.create(plants,{
             position: Vector3.create(48, 0, 40),
             rotation: Quaternion.create(0, 0, 0, 1),
             scale: Vector3.create(1, 1, 1),
             parent: _scene
         }); 
     
         GltfContainer.create(plants,{
             src:"models/mains/plants.glb"
         })

         //making musclesquareupdownpad model
         const musclesquareupdownpad = engine.addEntity()
         TransformSafeWrapper.create(musclesquareupdownpad,{
             position: Vector3.create(48, 0, 40),
             rotation: Quaternion.create(0, 0, 0, 1),
             scale: Vector3.create(1, 1, 1),
             parent: _scene
         }); 
     
         GltfContainer.create(musclesquareupdownpad,{
             src:"models/mains/musclesquareupdownpad.glb"
         })

         
         //making squares model
         /*const squares = engine.addEntity()
         TransformSafeCreate.create(squares,{
             position: Vector3.create(48, 0, 40),
             rotation: Quaternion.create(0, 0, 0, 1),
             scale: Vector3.create(1, 1, 1),
             parent: _scene
         }); 
     
         GltfContainer.create(squares,{
             src:"models/mains/squares.glb"
         })*/

         /*  
         //making DAOAlchemist model
         const DAOAlchemist = engine.addEntity()
         TransformSafeWrapper.create(DAOAlchemist,{
             position: Vector3.create(48, 0, 40),
             rotation: Quaternion.create(0, 0, 0, 1),
             scale: Vector3.create(1, 1, 1),
             parent: _scene
         }); 
     
         GltfContainer.create(DAOAlchemist,{
             src:"models/mains/DAOAlchemist.glb"
         }) */

         //making wheel of fortune
         //wheel of fortune moved to setupMinables
         //now tracked as id buyable.item.lucky.wheel
         /*const fortunewheel = engine.addEntity()
         TransformSafeWrapper.create(fortunewheel,{
             position: Vector3.create(48, 0, 40),
             rotation: Quaternion.create(0, 0, 0, 1),
             scale: Vector3.create(1, 1, 1),
             parent: _scene
         }); 
     
         GltfContainer.create(fortunewheel,{
             src:"models/fortunewheel.glb"
         })

          //making Adsboxes Goldtier model
          const Goldtier = engine.addEntity()
          TransformSafeWrapper.create(Goldtier,{
              position: Vector3.create(48, 0, 40),
              rotation: Quaternion.create(0, 0, 0, 1),
              scale: Vector3.create(1, 1, 1),
              parent: _scene
          }); 
      
          GltfContainer.create(Goldtier,{
              src:"models/mains/Goldtier.glb"
          })

          //making Adsboxes Silvertier model
          const Silvertier = engine.addEntity()
          TransformSafeWrapper.create(Silvertier,{
              position: Vector3.create(48, 0, 40),
              rotation: Quaternion.create(0, 0, 0, 1),
              scale: Vector3.create(1, 1, 1),
              parent: _scene
          }); 
      
          GltfContainer.create(Silvertier,{
              src:"models/mains/Silvertier.glb"
          })*/

           //making MineField Teleporter
           const MineFieldTeleporter = engine.addEntity()
           TransformSafeWrapper.create(MineFieldTeleporter,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           })

           GltfContainer.create(MineFieldTeleporter,{
               src:"models/MineFieldTeleporter.glb"
           })
           
           pointerEventsSystem.onPointerDown(
             {
               entity: MineFieldTeleporter,
               opts: { button: InputAction.IA_POINTER, hoverText: 'Farm Rocks' },
             },
             function () {
               // respawn player
               movePlayerTo({
                 newRelativePosition: Vector3.create(21, 0, 18),
                 cameraTarget: Vector3.create(16, 1.5, 24),
               })
             }
           )
           
           //making Guidebook model
           const Guidebook = engine.addEntity()
           TransformSafeWrapper.create(Guidebook,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene          
           }); 
           GltfContainer.create(Guidebook,{
               src:"models/Guidebook.glb"
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: Guidebook,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Read Guide' },
            },
            function () {
            openExternalUrl({url: "https://docs.google.com/document/d/1Qg2VaY3RVnUGqhmswCSlj-NNMS-Gbca9Ujn8YLpSBgc/edit?usp=sharing"})
            }
          )

          //making Poster
          const Poster = engine.addEntity()
          TransformSafeWrapper.create(Poster,{
              position: Vector3.create(50, -0.5, 40),
              rotation: Quaternion.create(0, 0, 0, 1),
              scale: Vector3.create(1, 1, 1),
              parent: _scene          
          }); 
          GltfContainer.create(Poster,{
              src:"models/Poster.glb"
          })

          pointerEventsSystem.onPointerDown(
           {
             entity: Poster,
             opts: { button: InputAction.IA_POINTER, hoverText: 'Check this out' },
           },
           function () {
           openExternalUrl({url: "https://vipe.io/explore/assets/avatars/8453/0xa94c652c16525e6b7cac82a34eab18b5174ad23c/600"})
           }
         ) 

            //making MetaDoge model// Check the position, it is post edited
            const MetaDoge = engine.addEntity()
            TransformSafeWrapper.create(MetaDoge,{
                position: Vector3.create(83.5, 0, 40),
                rotation: Quaternion.create(0, 0, 0, 1),
                scale: Vector3.create(1, 1, 1),
                parent: _scene          
            }); 
            GltfContainer.create(MetaDoge,{
                src:"models/Rewards/rewardmd.glb"
            })
 
            pointerEventsSystem.onPointerDown(
             {
               entity: MetaDoge,
               opts: { button: InputAction.IA_POINTER, hoverText: 'Check MetaDoge Website' },
             },
             function () {
             openExternalUrl({url: "https://www.metadoge.art"})
             }
           )



          //making teleportermuscle model
           const teleportermuscle = engine.addEntity()
           TransformSafeWrapper.create(teleportermuscle,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene          
           }); 
           GltfContainer.create(teleportermuscle,{
               src:"models/Teleporter/Musclesquare.glb"
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: teleportermuscle,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Go to Muscle Square' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(56, 5, 48),
                cameraTarget: Vector3.create(16, 1.5, 24),
              })
            }
          )
          
       
           //making teleportermoon model
           const teleportermoon = engine.addEntity()
           TransformSafeWrapper.create(teleportermoon,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           }); 

           GltfContainer.create(teleportermoon,{
               src:"models/Teleporter/Moonsquare.glb"
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: teleportermoon,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Go to Moon Square' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(24, 26, 48),
                cameraTarget: Vector3.create(16, 1.5, 24),
              })
            }
          )

           //making teleportermars model
           const teleportermars = engine.addEntity()
           TransformSafeWrapper.create(teleportermars,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           }); 

           GltfContainer.create(teleportermars,{
               src:"models/Teleporter/Marssquare.glb"
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: teleportermars,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Go to Mars Square' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(37, 32, 55),
                cameraTarget: Vector3.create(16, 1.5, 24),
              })
            }
          )

        
             //making teleporterheaven model
             const teleporterheaven = engine.addEntity()
             TransformSafeWrapper.create(teleporterheaven,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 
  
             GltfContainer.create(teleporterheaven,{
                 src:"models/Teleporter/Heavensquare.glb"
             })      

             pointerEventsSystem.onPointerDown(
              {
                entity: teleporterheaven,
                opts: { button: InputAction.IA_POINTER, hoverText: 'Go to Heaven Square' },
              },
              function () {
                // respawn player
                movePlayerTo({
                  newRelativePosition: Vector3.create(24, 51, 51),
                  cameraTarget: Vector3.create(16, 1.5, 24),
                })
              }
            )
 

//Add Twitter and Discord for brands Start

            //Add TwitterL1 
             const TwitterL1 = engine.addEntity()
             TransformSafeWrapper.create(TwitterL1,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterL1,{
                src:"models/Rewards/Sociallinks/TwitterL1.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterL1,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://x.com/Natfishes"})
                }
              )

              //Add DiscordL1 
             const DiscordL1 = engine.addEntity()
             TransformSafeWrapper.create(DiscordL1,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(DiscordL1,{
                src:"models/Rewards/Sociallinks/DiscordL1.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: DiscordL1,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Discord' },
                },
                function () {
                openExternalUrl({url: "https://discord.gg/6bcKZewsyj"})
                }
              )

              //Add TwitterL2 
             const TwitterL2 = engine.addEntity()
             TransformSafeWrapper.create(TwitterL2,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterL2,{
                src:"models/Rewards/Sociallinks/TwitterL2.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterL2,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/soulmagicnft"})
                }
              )

              //Add DiscordL2 
             const DiscordL2 = engine.addEntity()
             TransformSafeWrapper.create(DiscordL2,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(DiscordL2,{
                src:"models/Rewards/Sociallinks/DiscordL2.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: DiscordL2,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Discord' },
                },
                function () {
                openExternalUrl({url: "https://discord.com/invite/soulmagic"})
                }
              )

              //Add TwitterL3 
             const TwitterL3 = engine.addEntity()
             TransformSafeWrapper.create(TwitterL3,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterL3,{
                src:"models/Rewards/Sociallinks/TwitterL3.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterL3,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://x.com/anymagik"})
                }
              )

              //Add DiscordL3 
             const DiscordL3 = engine.addEntity()
             TransformSafeWrapper.create(DiscordL3,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(DiscordL3,{
                src:"models/Rewards/Sociallinks/DiscordL3.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: DiscordL3,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Discord' },
                },
                function () {
                openExternalUrl({url: "https://discord.com/invite/anymagik"})
                }
              )

               //Add TwitterL4 
             const TwitterL4 = engine.addEntity()
             TransformSafeWrapper.create(TwitterL4,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterL4,{
                src:"models/Rewards/Sociallinks/TwitterL4.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterL4,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/vipeio"})
                }
              )

              //Add DiscordL4 
             const DiscordL4 = engine.addEntity()
             TransformSafeWrapper.create(DiscordL4,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(DiscordL4,{
                src:"models/Rewards/Sociallinks/DiscordL4.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: DiscordL4,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Discord' },
                },
                function () {
                openExternalUrl({url: "https://discord.com/invite/vipeio"})
                }
              )

               //Add TwitterL5 
             const TwitterL5 = engine.addEntity()
             TransformSafeWrapper.create(TwitterL5,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterL5,{
                src:"models/Rewards/Sociallinks/TwitterL5.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterL5,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/DhingiaBuilds"})
                }
              )

              //Add DiscordL5 
             const DiscordL5 = engine.addEntity()
             TransformSafeWrapper.create(DiscordL5,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(DiscordL5,{
                src:"models/Rewards/Sociallinks/DiscordL5.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: DiscordL5,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Discord' },
                },
                function () {
                openExternalUrl({url: "https://discord.com/invite/3STwXc8D8u"})
                }
              )

   /*            //Add TwitterL6 
             const TwitterL6 = engine.addEntity()
             TransformSafeWrapper.create(TwitterL6,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterL6,{
                src:"models/Rewards/Sociallinks/TwitterL6.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterL6,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/DhingiaBuilds"})
                }
              )

              //Add DiscordL6 
             const DiscordL6 = engine.addEntity()
             TransformSafeWrapper.create(DiscordL6,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(DiscordL6,{
                src:"models/Rewards/Sociallinks/DiscordL6.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: DiscordL6,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Discord' },
                },
                function () {
                openExternalUrl({url: "https://discord.com/invite/3STwXc8D8u"})
                }
              )
 */
              //Add TwitterR1 
             const TwitterR1 = engine.addEntity()
             TransformSafeWrapper.create(TwitterR1,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterR1,{
                src:"models/Rewards/Sociallinks/TwitterR1.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterR1,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/DecentralGames"})
                }
              )

               //Add DiscordR1 
             const DiscordR1 = engine.addEntity()
             TransformSafeWrapper.create(DiscordR1,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(DiscordR1,{
                src:"models/Rewards/Sociallinks/DiscordR1.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: DiscordR1,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Discord' },
                },
                function () {
                openExternalUrl({url: "https://discord.com/invite/decentralgames"})
                }
              )

              //Add TwitterR2 
             const TwitterR2 = engine.addEntity()
             TransformSafeWrapper.create(TwitterR2,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterR2,{
                src:"models/Rewards/Sociallinks/TwitterR2.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterR2,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/pacmoon_"})
                }
              )
/*
               //Add DiscordR2 
             const DiscordR2 = engine.addEntity()
             TransformSafeWrapper.create(DiscordR2,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(DiscordR2,{
                src:"models/Rewards/Sociallinks/DiscordR2.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: DiscordR2,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Discord' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/pacmoon_"})
                }
              ) */

               //Add TwitterR3 
             const TwitterR3 = engine.addEntity()
             TransformSafeWrapper.create(TwitterR3,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterR3,{
                src:"models/Rewards/Sociallinks/TwitterR3.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterR3,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://x.com/stoney_eye"})
                }
              )

           /*    //Add DiscordR3 
             const DiscordR3 = engine.addEntity()
             TransformSafeWrapper.create(DiscordR3,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(DiscordR3,{
                src:"models/Rewards/Sociallinks/DiscordR3.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: DiscordR3,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Discord' },
                },
                function () {
                openExternalUrl({url: "https://discord.com/invite/e6v3nvCZ8Q"})
                }
              )
*/
                //Add TwitterR4 
             const TwitterR4 = engine.addEntity()
             TransformSafeWrapper.create(TwitterR4,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterR4,{
                src:"models/Rewards/Sociallinks/TwitterR4.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterR4,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://x.com/MetafoxCrew"})
                }
              )

               //Add DiscordR4 
             const DiscordR4 = engine.addEntity()
             TransformSafeWrapper.create(DiscordR4,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(DiscordR4,{
                src:"models/Rewards/Sociallinks/DiscordR4.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: DiscordR4,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Discord' },
                },
                function () {
                openExternalUrl({url: "https://discord.com/invite/YbBqhbmKh2"})
                }
              )

            //Add TwitterR5 
             const TwitterR5 = engine.addEntity()
             TransformSafeWrapper.create(TwitterR5,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterR5,{
                src:"models/Rewards/Sociallinks/TwitterR5.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterR5,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://x.com/freethought3D"})
                }
              )

            //Add DiscordR5 
             const DiscordR5 = engine.addEntity()
             TransformSafeWrapper.create(DiscordR5,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(DiscordR5,{
                src:"models/Rewards/Sociallinks/DiscordR5.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: DiscordR5,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Website' },
                },
                function () {
                openExternalUrl({url: "https://www.pupbusiness.com/"})
                }
              )

              //Add TwitterR6 
             const TwitterR6 = engine.addEntity()
             TransformSafeWrapper.create(TwitterR6,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterR6,{
                src:"models/Rewards/Sociallinks/TwitterR6.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterR6,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://x.com/VoxBoardsNFT"})
                }
              )

            //Add DiscordR6 
             const DiscordR6 = engine.addEntity()
             TransformSafeWrapper.create(DiscordR6,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(DiscordR6,{
                src:"models/Rewards/Sociallinks/DiscordR6.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: DiscordR6,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Website' },
                },
                function () {
                openExternalUrl({url: "https://linktr.ee/voxboards"})
                }
              )
/*
              //Add TwitterR61 
             const TwitterR61 = engine.addEntity()
             TransformSafeWrapper.create(TwitterR61,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterR61,{
                src:"models/Rewards/Sociallinks/TwitterR61.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterR61,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/SpottieWiFi"})
                }
              )

            //Add DiscordR61 
             const DiscordR61 = engine.addEntity()
             TransformSafeWrapper.create(DiscordR61,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(DiscordR61,{
                src:"models/Rewards/Sociallinks/DiscordR61.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: DiscordR61,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Website' },
                },
                function () {
                openExternalUrl({url: "http://discord.com/invite/PQwdjaqKpc"})
                }
              )
*/
            //Add TwitterS1 
             const TwitterS1 = engine.addEntity()
             TransformSafeWrapper.create(TwitterS1,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterS1,{
                src:"models/Rewards/Sociallinks/TwitterS1.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterS1,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/freethought3D"})
                }
              )

              //Add TwitterS2 
             const TwitterS2 = engine.addEntity()
             TransformSafeWrapper.create(TwitterS2,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterS2,{
                src:"models/Rewards/Sociallinks/TwitterS2.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterS2,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/SpanishMuseum"})
                }
              )

               //Add TwitterS3 
             const TwitterS3 = engine.addEntity()
             TransformSafeWrapper.create(TwitterS3,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterS3,{
                src:"models/Rewards/Sociallinks/TwitterS3.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterS3,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/DJTRAXNFT"})
                }
              )

                //Add TwitterS4 
             const TwitterS4 = engine.addEntity()
             TransformSafeWrapper.create(TwitterS4,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterS4,{
                src:"models/Rewards/Sociallinks/TwitterS4.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterS4,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/LowPolyModelsW"})
                }
              )

              //Add TwitterS5 
             const TwitterS5 = engine.addEntity()
             TransformSafeWrapper.create(TwitterS5,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterS5,{
                src:"models/Rewards/Sociallinks/TwitterS5.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterS5,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/PunkPink__"})
                }
              )

              //Add TwitterS6 
             const TwitterS6 = engine.addEntity()
             TransformSafeWrapper.create(TwitterS6,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterS6,{
                src:"models/Rewards/Sociallinks/TwitterS6.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterS6,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/GolfcraftGame"})
                }
              )

               //Add TwitterS7 
             const TwitterS7 = engine.addEntity()
             TransformSafeWrapper.create(TwitterS7,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterS7,{
                src:"models/Rewards/Sociallinks/TwitterS7.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterS7,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/polygonalmind"})
                }
              )

              //Add TwitterS8 
             const TwitterS8 = engine.addEntity()
             TransformSafeWrapper.create(TwitterS8,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterS8,{
                src:"models/Rewards/Sociallinks/TwitterS8.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterS8,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/CocaCola"})
                }
              )

              //Add TwitterS9 
             const TwitterS9 = engine.addEntity()
             TransformSafeWrapper.create(TwitterS9,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterS9,{
                src:"models/Rewards/Sociallinks/TwitterS9.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterS9,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://sx.bet/"})
                }
              )

              //Add TwitterS10 
             const TwitterS10 = engine.addEntity()
             TransformSafeWrapper.create(TwitterS10,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterS10,{
                src:"models/Rewards/Sociallinks/TwitterS10.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterS10,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://sx.bet/"})
                }
              )

              //Add TwitterS11 
             const TwitterS11 = engine.addEntity()
             TransformSafeWrapper.create(TwitterS11,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterS11,{
                src:"models/Rewards/Sociallinks/TwitterS11.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterS11,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/SpottieWiFi"})
                }
              )

              //Add TwitterS12 
             const TwitterS12 = engine.addEntity()
             TransformSafeWrapper.create(TwitterS12,{
                 position: Vector3.create(48, 0, 40),
                 rotation: Quaternion.create(0, 0, 0, 1),
                 scale: Vector3.create(1, 1, 1),
                 parent: _scene
             }); 

             GltfContainer.create(TwitterS12,{
                src:"models/Rewards/Sociallinks/TwitterS12.glb"
            })      

            pointerEventsSystem.onPointerDown(
                {
                  entity: TwitterS12,
                  opts: { button: InputAction.IA_POINTER, hoverText: 'Check Brand Twitter' },
                },
                function () {
                openExternalUrl({url: "https://twitter.com/creatordaocc"})
                }
              )

            //Add Twitter and Discord for brands End

            //Add AdsShop teleporter Start

            //making TeleporterL1 Teleporter
           const TeleporterL1 = engine.addEntity()
           TransformSafeWrapper.create(TeleporterL1,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           })

           GltfContainer.create(TeleporterL1,{
               src:"models/Rewards/TeleporterL1.glb"
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: TeleporterL1,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Brand AdsShop' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(11.6, 11, 22.7),
                cameraTarget: Vector3.create(50, 1.8, 0),
              })
            }
          )

           //making TeleporterL2 Teleporter
           const TeleporterL2 = engine.addEntity()
           TransformSafeWrapper.create(TeleporterL2,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           })

           GltfContainer.create(TeleporterL2,{
               src:"models/Rewards/TeleporterL2.glb"
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: TeleporterL2,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Brand AdsShop' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(12, 24, 49.7),
                cameraTarget: Vector3.create(16, 1.5, 24),
              })
            }
          )

           //making TeleporterL3 Teleporter
           const TeleporterL3 = engine.addEntity()
           TransformSafeWrapper.create(TeleporterL3,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           })

           GltfContainer.create(TeleporterL3,{
               src:"models/Rewards/TeleporterL3.glb"
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: TeleporterL3,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Brand AdsShop' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(16.3, 51, 50),
                cameraTarget: Vector3.create(16, 1.5, 24),
              })
            }
          )

           //making TeleporterL4 Teleporter
           const TeleporterL4 = engine.addEntity()
           TransformSafeWrapper.create(TeleporterL4,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           })

           GltfContainer.create(TeleporterL4,{
               src:"models/Rewards/TeleporterL4.glb"
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: TeleporterL4,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Brand AdsShop' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(36, 32, 47.7),
                cameraTarget: Vector3.create(16, 1.5, 24),
              })
            }
          )

           //making TeleporterL5 Teleporter
           const TeleporterL5 = engine.addEntity()
           TransformSafeWrapper.create(TeleporterL5,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           })

           GltfContainer.create(TeleporterL5,{
               src:"models/Rewards/TeleporterL5.glb"
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: TeleporterL5,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Brand AdsShop' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(55.7, 14, 72),
                cameraTarget: Vector3.create(16, 1.5, 24),
              })
            }
          )

           //making TeleporterL6 Teleporter
           const TeleporterL6 = engine.addEntity()
           TransformSafeWrapper.create(TeleporterL6,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           })

           GltfContainer.create(TeleporterL6,{
               src:"models/Rewards/TeleporterL6.glb"
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: TeleporterL6,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Brand AdsShop' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(70.5, 2.5, 79.2),
                cameraTarget: Vector3.create(16, 1.5, 24),
              })
            }
          )

           //making TeleporterR1 Teleporter
           const TeleporterR1 = engine.addEntity()
           TransformSafeWrapper.create(TeleporterR1,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           })

           GltfContainer.create(TeleporterR1,{
               src:"models/Rewards/TeleporterR1.glb"
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: TeleporterR1,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Brand AdsShop' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(12, 24, 37.2),
                cameraTarget: Vector3.create(16, 1.5, 24),
              })
            }
          )

           //making TeleporterR2 Teleporter
           const TeleporterR2 = engine.addEntity()
           TransformSafeWrapper.create(TeleporterR2,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: TeleporterR2,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Brand AdsShop' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(12, 24, 62.5),
                cameraTarget: Vector3.create(16, 1.5, 24),
              })
            }
          )

           GltfContainer.create(TeleporterR2,{
               src:"models/Rewards/TeleporterR2.glb"
           })

           //making TeleporterR3 Teleporter
           const TeleporterR3 = engine.addEntity()
           TransformSafeWrapper.create(TeleporterR3,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: TeleporterR3,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Brand AdsShop' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(16.3, 51, 60),
                cameraTarget: Vector3.create(16, 1.5, 24),
              })
            }
          )

           GltfContainer.create(TeleporterR3,{
               src:"models/Rewards/TeleporterR3.glb"
           })

           //making TeleporterR4 Teleporter
           const TeleporterR4 = engine.addEntity()
           TransformSafeWrapper.create(TeleporterR4,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           })

           GltfContainer.create(TeleporterR4,{
            src:"models/Rewards/TeleporterR4.glb"
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: TeleporterR4,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Brand AdsShop' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(47, 32, 47.7),
                cameraTarget: Vector3.create(16, 1.5, 24),
              })
            }
          )

           //making TeleporterR5 Teleporter
           const TeleporterR5 = engine.addEntity()
           TransformSafeWrapper.create(TeleporterR5,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           })

           GltfContainer.create(TeleporterR5,{
               src:"models/Rewards/TeleporterR5.glb"
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: TeleporterR5,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Brand AdsShop' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(55.8, 14, 40),
                cameraTarget: Vector3.create(16, 1.5, 24),
              })
            }
          )

           //making TeleporterR6 Teleporter
           const TeleporterR6 = engine.addEntity()
           TransformSafeWrapper.create(TeleporterR6,{
               position: Vector3.create(48, 0, 40),
               rotation: Quaternion.create(0, 0, 0, 1),
               scale: Vector3.create(1, 1, 1),
               parent: _scene
           })

           GltfContainer.create(TeleporterR6,{
               src:"models/Rewards/TeleporterR6.glb"
           })

           pointerEventsSystem.onPointerDown(
            {
              entity: TeleporterR6,
              opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Brand AdsShop' },
            },
            function () {
              // respawn player
              movePlayerTo({
                newRelativePosition: Vector3.create(70.5, 2.5, 66),
                cameraTarget: Vector3.create(16, 1.5, 24),
              })
            }
          )
/*
          //making TeleporterR61 Teleporter
          const TeleporterR61 = engine.addEntity()
          TransformSafeWrapper.create(TeleporterR61,{
              position: Vector3.create(48, 0, 40),
              rotation: Quaternion.create(0, 0, 0, 1),
              scale: Vector3.create(1, 1, 1),
              parent: _scene
          })

          GltfContainer.create(TeleporterR61,{
              src:"models/Rewards/TeleporterR61.glb"
          })

          pointerEventsSystem.onPointerDown(
           {
             entity: TeleporterR61,
             opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Brand AdsShop' },
           },
           function () {
             // respawn player
             movePlayerTo({
               newRelativePosition: Vector3.create(60, 31.5, 47.6),
               cameraTarget: Vector3.create(16, 1.5, 24),
             })
           }
         )
*/
         //making SP1Teleportertorewardscenter Teleporter
         const SP1Teleportertorewardscenter = engine.addEntity()
         TransformSafeWrapper.create(SP1Teleportertorewardscenter,{
             position: Vector3.create(48, 0, 40),
             rotation: Quaternion.create(0, 0, 0, 1),
             scale: Vector3.create(1, 1, 1),
             parent: _scene
         })

         GltfContainer.create(SP1Teleportertorewardscenter,{
             src:"models/Adsshops/SP1Teleportertorewardscenter.glb"
         })

         pointerEventsSystem.onPointerDown(
          {
            entity: SP1Teleportertorewardscenter,
            opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Rewards Center' },
          },
          function () {
            // respawn player
            movePlayerTo({
              newRelativePosition: Vector3.create(40, 2, 11.5),
              cameraTarget: Vector3.create(40, 1.8, 40),
            })
          }
        )

        //making SP2Teleportertorewardscenter Teleporter
        const SP2Teleportertorewardscenter = engine.addEntity()
        TransformSafeWrapper.create(SP2Teleportertorewardscenter,{
            position: Vector3.create(48, 0, 40),
            rotation: Quaternion.create(0, 0, 0, 1),
            scale: Vector3.create(1, 1, 1),
            parent: _scene
        })

        GltfContainer.create(SP2Teleportertorewardscenter,{
            src:"models/Adsshops/SP2Teleportertorewardscenter.glb"
        })

        pointerEventsSystem.onPointerDown(
         {
           entity: SP2Teleportertorewardscenter,
           opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Rewards Center' },
         },
         function () {
           // respawn player
           movePlayerTo({
             newRelativePosition: Vector3.create(40, 2, 11.5),
             cameraTarget: Vector3.create(40, 1.8, 40),
           })
         }
       )

       //making SP3Teleportertorewardscenter Teleporter
       const SP3Teleportertorewardscenter = engine.addEntity()
       TransformSafeWrapper.create(SP3Teleportertorewardscenter,{
           position: Vector3.create(48, 0, 40),
           rotation: Quaternion.create(0, 0, 0, 1),
           scale: Vector3.create(1, 1, 1),
           parent: _scene
       })

       GltfContainer.create(SP3Teleportertorewardscenter,{
           src:"models/Adsshops/SP3Teleportertorewardscenter.glb"
       })

       pointerEventsSystem.onPointerDown(
        {
          entity: SP3Teleportertorewardscenter,
          opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Rewards Center' },
        },
        function () {
          // respawn player
          movePlayerTo({
            newRelativePosition: Vector3.create(40, 2, 11.5),
            cameraTarget: Vector3.create(40, 1.8, 40),
          })
        }
      )

      //making SP4Teleportertorewardscenter Teleporter
      const SP4Teleportertorewardscenter = engine.addEntity()
      TransformSafeWrapper.create(SP4Teleportertorewardscenter,{
          position: Vector3.create(48, 0, 40),
          rotation: Quaternion.create(0, 0, 0, 1),
          scale: Vector3.create(1, 1, 1),
          parent: _scene
      })

      GltfContainer.create(SP4Teleportertorewardscenter,{
          src:"models/Adsshops/SP4Teleportertorewardscenter.glb"
      })

      pointerEventsSystem.onPointerDown(
       {
         entity: SP4Teleportertorewardscenter,
         opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Rewards Center' },
       },
       function () {
         // respawn player
         movePlayerTo({
           newRelativePosition: Vector3.create(40, 2, 11.5),
           cameraTarget: Vector3.create(40, 1.8, 40),
         })
       }
     )

     //making SP5Teleportertorewardscenter Teleporter
     const SP5Teleportertorewardscenter = engine.addEntity()
     TransformSafeWrapper.create(SP5Teleportertorewardscenter,{
         position: Vector3.create(48, 0, 40),
         rotation: Quaternion.create(0, 0, 0, 1),
         scale: Vector3.create(1, 1, 1),
         parent: _scene
     })

     GltfContainer.create(SP5Teleportertorewardscenter,{
         src:"models/Adsshops/SP5Teleportertorewardscenter.glb"
     })

     pointerEventsSystem.onPointerDown(
      {
        entity: SP5Teleportertorewardscenter,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Rewards Center' },
      },
      function () {
        // respawn player
        movePlayerTo({
          newRelativePosition: Vector3.create(40, 2, 45),
          cameraTarget: Vector3.create(40, 1.8, 40),
        })
      }
    )

    //making SP6Teleportertorewardscenter Teleporter
    const SP6Teleportertorewardscenter = engine.addEntity()
    TransformSafeWrapper.create(SP6Teleportertorewardscenter,{
        position: Vector3.create(48, 0, 40),
        rotation: Quaternion.create(0, 0, 0, 1),
        scale: Vector3.create(1, 1, 1),
        parent: _scene
    })

    GltfContainer.create(SP6Teleportertorewardscenter,{
        src:"models/Adsshops/SP6Teleportertorewardscenter.glb"
    })

    pointerEventsSystem.onPointerDown(
     {
       entity: SP6Teleportertorewardscenter,
       opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Rewards Center' },
     },
     function () {
       // respawn player
       movePlayerTo({
         newRelativePosition: Vector3.create(40, 2, 45),
         cameraTarget: Vector3.create(40, 1.8, 40),
       })
     }
   )

   //making SP7Teleportertorewardscenter Teleporter
   const SP7Teleportertorewardscenter = engine.addEntity()
   TransformSafeWrapper.create(SP7Teleportertorewardscenter,{
       position: Vector3.create(48, 0, 40),
       rotation: Quaternion.create(0, 0, 0, 1),
       scale: Vector3.create(1, 1, 1),
       parent: _scene
   })

   GltfContainer.create(SP7Teleportertorewardscenter,{
       src:"models/Adsshops/SP7Teleportertorewardscenter.glb"
   })

   pointerEventsSystem.onPointerDown(
    {
      entity: SP7Teleportertorewardscenter,
      opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Rewards Center' },
    },
    function () {
      // respawn player
      movePlayerTo({
        newRelativePosition: Vector3.create(40, 2, 45),
        cameraTarget: Vector3.create(40, 1.8, 40),
      })
    }
  )

  //making SP8Teleportertorewardscenter Teleporter
  const SP8Teleportertorewardscenter = engine.addEntity()
  TransformSafeWrapper.create(SP8Teleportertorewardscenter,{
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
      parent: _scene
  })

  GltfContainer.create(SP8Teleportertorewardscenter,{
      src:"models/Adsshops/SP8Teleportertorewardscenter.glb"
  })

  pointerEventsSystem.onPointerDown(
   {
     entity: SP8Teleportertorewardscenter,
     opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Rewards Center' },
   },
   function () {
     // respawn player
     movePlayerTo({
       newRelativePosition: Vector3.create(40, 2, 45),
       cameraTarget: Vector3.create(40, 1.8, 40),
     })
   }
 )

 const SP9Teleportertorewardscenter = engine.addEntity()
  TransformSafeWrapper.create(SP9Teleportertorewardscenter,{
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
      parent: _scene
  })

  GltfContainer.create(SP9Teleportertorewardscenter,{
      src:"models/Adsshops/SP9Teleportertorewardscenter.glb"
  })

  pointerEventsSystem.onPointerDown(
   {
     entity: SP9Teleportertorewardscenter,
     opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Rewards Center' },
   },
   function () {
     // respawn player
     movePlayerTo({
       newRelativePosition: Vector3.create(40, 2, 45),
       cameraTarget: Vector3.create(40, 1.8, 40),
     })
   }
 )

 const SP10Teleportertorewardscenter = engine.addEntity()
  TransformSafeWrapper.create(SP10Teleportertorewardscenter,{
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
      parent: _scene
  })

  GltfContainer.create(SP10Teleportertorewardscenter,{
      src:"models/Adsshops/SP10Teleportertorewardscenter.glb"
  })

  pointerEventsSystem.onPointerDown(
   {
     entity: SP10Teleportertorewardscenter,
     opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Rewards Center' },
   },
   function () {
     // respawn player
     movePlayerTo({
       newRelativePosition: Vector3.create(40, 2, 45),
       cameraTarget: Vector3.create(40, 1.8, 40),
     })
   }
 )

 const SP11Teleportertorewardscenter = engine.addEntity()
  TransformSafeWrapper.create(SP11Teleportertorewardscenter,{
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
      parent: _scene
  })

  GltfContainer.create(SP11Teleportertorewardscenter,{
      src:"models/Adsshops/SP11Teleportertorewardscenter.glb"
  })

  pointerEventsSystem.onPointerDown(
   {
     entity: SP11Teleportertorewardscenter,
     opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Rewards Center' },
   },
   function () {
     // respawn player
     movePlayerTo({
       newRelativePosition: Vector3.create(40, 2, 45),
       cameraTarget: Vector3.create(40, 1.8, 40),
     })
   }
 )

 const SP12Teleportertorewardscenter = engine.addEntity()
  TransformSafeWrapper.create(SP12Teleportertorewardscenter,{
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
      parent: _scene
  })

  GltfContainer.create(SP12Teleportertorewardscenter,{
      src:"models/Adsshops/SP12Teleportertorewardscenter.glb"
  })

  pointerEventsSystem.onPointerDown(
   {
     entity: SP12Teleportertorewardscenter,
     opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Rewards Center' },
   },
   function () {
     // respawn player
     movePlayerTo({
       newRelativePosition: Vector3.create(40, 2, 45),
       cameraTarget: Vector3.create(40, 1.8, 40),
     })
   }
 )

 const SP61Teleportertorewardscenter = engine.addEntity()
  TransformSafeWrapper.create(SP61Teleportertorewardscenter,{
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
      parent: _scene
  })

  GltfContainer.create(SP61Teleportertorewardscenter,{
      src:"models/Adsshops/SP61Teleportertorewardscenter.glb"
  })

  pointerEventsSystem.onPointerDown(
   {
     entity: SP61Teleportertorewardscenter,
     opts: { button: InputAction.IA_POINTER, hoverText: 'Teleport to Rewards Center' },
   },
   function () {
     // respawn player
     movePlayerTo({
       newRelativePosition: Vector3.create(40, 2, 45),
       cameraTarget: Vector3.create(40, 1.8, 40),
     })
   }
 )

 


    }catch(e){
        console.log("ERROR loading scene.ts",e)
        //debugger
        throw e 
    } 
}