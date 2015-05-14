﻿class AnimationSystem implements ISystem {
    private tick = 1;
    RequiredSygnature = Componenets.Movement + Componenets.Sprite + Componenets.CharacterAnimation + Componenets.Position;

    constructor() {
        setInterval(() => { this.tick++; }, 150);
    }

    Process(world: World) {
        var objList = world.entityList;
        for (var i = 0; i < objList.length; i++) {
            var charAnimComponent = <CharacterAnimationComponent> objList[i].ComponentList[Componenets.CharacterAnimation];


            if (charAnimComponent) {
                this.ChracterMovement(objList[i]);
                continue;
            }

            var simpleAnimComponent = <SimpleAnimationComponent> objList[i].ComponentList[Componenets.SimpleAnimation];

            if (simpleAnimComponent) {
                var spriteComponent = <SpriteComponent> objList[i].ComponentList[Componenets.Sprite];
                if (!simpleAnimComponent.StartTick) {
                    simpleAnimComponent.StartTick = this.tick;
                }
                if (this.tick - simpleAnimComponent.StartTick > simpleAnimComponent.AnimationList.length - 1) {
                    world.entityList.splice(i, 1);
                    i--;
                    continue;
                }
                spriteComponent.RenderingSprite =
                simpleAnimComponent.AnimationList[(this.tick - simpleAnimComponent.StartTick) % simpleAnimComponent.AnimationList.length];
            }
        }
    }



    private ChracterMovement(gameObj: GameObj) {
        if ((gameObj.ComponentSygnature & this.RequiredSygnature) !== this.RequiredSygnature) return;

        var positionComponent = <PositionComponent> gameObj.ComponentList[Componenets.Position];
        var characterAnimationComponent = <CharacterAnimationComponent> gameObj.ComponentList[Componenets.CharacterAnimation];
        var spriteComponent = <SpriteComponent> gameObj.ComponentList[Componenets.Sprite];
        var movementComponent = <MovementComponent> gameObj.ComponentList[Componenets.Movement];
        var movingAnimFrameOffset = 0;
        if (movementComponent.IsMoving) {
            movingAnimFrameOffset = (this.tick % 2) + 1;
        }

        switch (positionComponent.Rotation) {
            case Rotation.Down:
                spriteComponent.RenderingSprite = characterAnimationComponent.SpriteList[0 + movingAnimFrameOffset];
                break;
            case Rotation.Top:
                spriteComponent.RenderingSprite = characterAnimationComponent.SpriteList[3 + movingAnimFrameOffset];
                break;
            case Rotation.Right:
                spriteComponent.RenderingSprite = characterAnimationComponent.SpriteList[6 + movingAnimFrameOffset];
                break;
            case Rotation.Left:
                spriteComponent.RenderingSprite = characterAnimationComponent.SpriteList[9 + movingAnimFrameOffset];
                break;
            default:
                spriteComponent.RenderingSprite = characterAnimationComponent.SpriteList[0];
        }


    }

}