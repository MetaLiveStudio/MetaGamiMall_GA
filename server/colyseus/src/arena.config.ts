import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom";
import { RandomPlacementChaseRoom } from "./rooms/RandomPlacementChaseRoom";
import { RandomPlacementRoom } from "./rooms/RandomPlacementRoom";
import { VoxBoardParkRoom } from "./rooms/VoxBoardParkRoom";


export default Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        //deprecated
        gameServer
            .define('my_room', MyRoom)
            .filterBy(['realm','playerId']);
        
        //future names
        //level_ufo_elevetors

        //level_pad_surfer
        gameServer
        .define('level_pad_surfer', MyRoom)
        .filterBy(['realm','playerId']);

        gameServer
        .define('level_random_ground_float', RandomPlacementRoom)
        .filterBy(['realm','playerId']);
        
        gameServer
        .define('level_random_ground_float_few', RandomPlacementChaseRoom)
        .filterBy(['realm','playerId']);

        gameServer
        .define('vox_board_park', VoxBoardParkRoom)
        .filterBy(['realm','playerId']);
    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});