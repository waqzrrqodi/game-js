class Building extends Sprite {
  constructor(type, damage, { position = { x: 0, y: 0 } }) {
    super({
      position,
      imageSrc: './img/' + type + '.png',
      frames: {
        max: 19
      },
      offset: {
        x: 0,
        y: -80
      }
    })

    this.width = 64 * 2
    this.height = 64
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    }
    this.type = type
    this.projectiles = []
    this.damage = damage
    if (this.type === 'badbuild') {
      this.radius = 150
    }
    else if (this.type === 'mediumbuild') {
      this.radius = 200
    }
    else if (this.type === 'goodbuild') {
      this.radius = 250
    }
    this.target
  }

  draw() {
    super.draw()

    // Debug for showing the radius of the building

    // c.beginPath()
    // c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
    // c.fillStyle = 'rgba(0, 0, 255, 0.2)'
    // c.fill()
  }

  // plays the animation and shoots the projectile
  update() {
    this.draw()
    if (this.target || (!this.target && this.frames.current !== 0))
      super.update()

    if (
      this.target &&
      this.frames.current === 6 &&
      this.frames.elapsed % this.frames.hold === 0
    )
      this.shoot()
  }
  // this is where the projectile is created
  shoot() {
    this.projectiles.push(
      new Projectile(this.damage, {
        position: {
          x: this.center.x - 20,
          y: this.center.y - 110
        },
        enemy: this.target
      })
    )
  }
}
