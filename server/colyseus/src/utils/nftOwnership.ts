//import { getUserData } from "@decentraland/Identity";

export class NFTOwnership {
  
  public userData: any;
  constructor() {
    async () => {
      this.userData = null;
      
    };
  }

  setUserData(userData:any){
    this.userData = userData
  }

  getUsersData = async () => {
    if (!this.userData) {
      //this.userData = await getUserData();
      //return this.userData;
    }
    return this.userData;
  };

}
