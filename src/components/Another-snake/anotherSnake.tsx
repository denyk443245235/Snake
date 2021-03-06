import React from 'react';
import { Block } from '../Block/block';
import BlockComponent from '../Block/block';
import { Game } from '../game';
import openSocket from 'socket.io-client';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import socket from '../socket';
interface Props {
    game: Game
}
@observer
export default class AnotherSnake extends React.Component<Props>{
    @observable blocksComponent: JSX.Element[] | undefined;
    interval: any;
    constructor(props: Props) {
        super(props);


    }
    @action startMove(request: { blocks: Block[], direction: String }) {
        clearInterval(this.interval);
        var { blocks, direction } = request;
        this.interval = setInterval(() => {
            var previos = Object.assign({}, blocks[0].coordinate);
            var before;
            for (var i = 0; i < blocks.length; i++) {
                if (blocks[i].type == 'head') {
                    if (direction == 'ArrowRight')
                        blocks[i].coordinate.x += 10;
                    if (direction == 'ArrowDown')
                        blocks[i].coordinate.y += 10;
                    if (direction == 'ArrowUp')
                        blocks[i].coordinate.y -= 10;
                    if (direction == 'ArrowLeft')
                        blocks[i].coordinate.x -= 10;
                }
                else {
                    before = Object.assign({}, blocks[i].coordinate);
                    blocks[i].coordinate.x = previos.x;
                    blocks[i].coordinate.y = previos.y;
                    previos = Object.assign({}, before);
                }
            }
            this.blocksComponent = blocks.map((item, index) => {
                return (
                    <rect x={item.coordinate.x} y={item.coordinate.y} width="10" height="10" fill='rgb(118, 249, 0)' />
                )
            })
        }, 200);
    }
    componentDidMount() {
        socket.on('newCoordinate', (request: { blocks: Block[], direction: String }) => {
            this.startMove(request);
        })
    }
    render() {
        if (this.blocksComponent) {
            return (
                this.blocksComponent
            )
        }
        else {
            return (
                <div></div>
            )
        }

    }
}