import Block from '/game/js/block.js'

export default class Sand extends Block {
    id = 'game:sand'

    properties: BlockProperties = {
        hasGravity: true
    }
}