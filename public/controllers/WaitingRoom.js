import {redirect} from '../utilities/routerUtilities';
import SocketIOClient from '../socketClient';

export default class WaitingRoom {
    constructor(type, id) {
        this.view = 'waitingRoom.html';
        this.type = type;
        this.game = { id }
    }

    init() {
        this.homeButton = document.querySelector("#top-left-button");
        this.idPartyDOM = document.querySelector("#id-party");

        SocketIOClient.service('games').get(this.game.id)
            .then(game => {
                if(game && !game.UnauthorizedAccess){
                    console.log('init', game.participants);
                    this.game = game;
                    this.handleWaitingRoom();
                }
                else{
                    window.location = '#/partysettings/partytype';
                }
            })

        this.homeButton.addEventListener('click', (evt) => redirect(evt, "#"), {once : true});
    }

    handleWaitingRoom(){
        this.idPartyDOM.textContent = `#${this.game.id}`
        SocketIOClient.service('games').on('updated', (game) => {
            console.log('update',game.participants);
        })
    }
}