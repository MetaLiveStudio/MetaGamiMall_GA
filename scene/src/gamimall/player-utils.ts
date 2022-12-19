import { GAME_STATE, PlayerState } from "src/state";
import {
  getAndSetUserData,
  getAndSetUserDataIfNullNoWait,
  getUserDataFromLocal,
} from "src/userData";

export function getUserDisplayName(
  playerState: PlayerState
): string | number | undefined {
  //TODO add fallback values to this
  //DisplayName can be null if someother player claimed it, show SHA?
  let playerName =
    playerState.playFabUserInfo?.AccountInfo?.TitleInfo?.DisplayName;

  if (playerName === undefined) {
    getAndSetUserDataIfNullNoWait(); //not calling await, hoping its fast

    const dclNamePlayerName = GAME_STATE.playerState.dclUserData?.displayName;

    log(
      "getUserDisplayName. playfab.displayName was null. using dcl name",
      playerName,
      dclNamePlayerName
    );

    playerName = dclNamePlayerName;
  }

  return playerName;
}
