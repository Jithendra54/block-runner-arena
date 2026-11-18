export type GameState = { score: number; coins: number; distance: number; running: boolean; over: boolean; paused: boolean }
type Obstacle = { lane: number; z: number; kind: 'barrier' | 'coin' | 'train'; hit: boolean }

export class Runner {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  lane = 1
  jump = 0
  slide = 0
  speed = 0.29
  last = 0
  spawn = 0
  obstacles: Obstacle[] = []
  raf = 0
  startedAt = 0
  state: GameState = { score: 0, coins: 0, distance: 0, running: false, over: false, paused: false }
  onChange: (s: GameState) => void
  onOver: (run: GameState, durationMs: number) => void
  constructor(canvas: HTMLCanvasElement, onChange: (s: GameState) => void, onOver: (run: GameState, durationMs: number) => void) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas unavailable')
    this.ctx = ctx; this.onChange = onChange; this.onOver = onOver
  }
  start() { this.state = { score: 0, coins: 0, distance: 0, running: true, over: false, paused: false }; this.lane = 1; this.jump = 0; this.slide = 0; this.speed = 0.29; this.last = 0; this.startedAt = performance.now(); this.spawn = 0; this.obstacles = []; this.onChange(this.state); cancelAnimationFrame(this.raf); this.raf = requestAnimationFrame(this.frame) }
  pause() { if (!this.state.running || this.state.over) return; this.state.paused = !this.state.paused; this.onChange(this.state); if (!this.state.paused) { this.last = 0; this.raf = requestAnimationFrame(this.frame) } }
  move(dir: number) { this.lane = Math.max(0, Math.min(2, this.lane + dir)) }
  act(kind: 'jump'|'slide') { if (kind === 'jump') this.jump = 0.72; else this.slide = 0.65 }
  frame = (time: number) => {
    if (!this.state.running || this.state.paused || this.state.over) return
    const dt = Math.min((time - (this.last || time)) / 1000, 0.04); this.last = time
    this.state.distance += this.speed * dt * 60; this.state.score = Math.floor(this.state.distance) + this.state.coins * 25
    this.speed = Math.min(0.62, 0.29 + this.state.distance / 18000)
    this.jump = Math.max(0, this.jump - dt); this.slide = Math.max(0, this.slide - dt)
    this.spawn -= dt
    if (this.spawn <= 0) { const lane = Math.floor(Math.random()*3); const roll = Math.random(); this.obstacles.push({lane,z:0,kind:roll<0.23?'coin':roll<0.55?'barrier':'train',hit:false}); this.spawn = Math.max(0.42, 0.95 - this.speed*0.7) }
    this.obstacles.forEach(o => { o.z += this.speed*dt; if (!o.hit && o.z > 0.84 && o.z < 0.94 && o.lane === this.lane) { o.hit=true; if (o.kind==='coin') this.state.coins++; else if ((o.kind==='barrier' && this.jump<0.25) || (o.kind==='train' && this.slide<0.25)) this.state.over=true } })
    this.obstacles = this.obstacles.filter(o=>o.z<1.08)
    this.draw()
    if (this.state.over) { this.state.running=false; this.onChange({...this.state}); this.onOver({...this.state}, Math.max(1000, time-this.startedAt)); return }
    this.onChange({...this.state})
    this.raf=requestAnimationFrame(this.frame)
  }
  draw() {
    const c=this.canvas, x=this.ctx, w=c.clientWidth, h=c.clientHeight, dpr=Math.min(window.devicePixelRatio||1,2)
    if (c.width!==Math.floor(w*dpr)||c.height!==Math.floor(h*dpr)) { c.width=Math.floor(w*dpr); c.height=Math.floor(h*dpr) }
    x.setTransform(dpr,0,0,dpr,0,0); x.clearRect(0,0,w,h)
    const g=x.createLinearGradient(0,0,0,h); g.addColorStop(0,'#172d43'); g.addColorStop(0.55,'#304050'); g.addColorStop(1,'#161f2b'); x.fillStyle=g; x.fillRect(0,0,w,h)
    x.fillStyle='#f8b953'; x.beginPath(); x.arc(w*.78,h*.2,25,0,Math.PI*2); x.fill()
    for(let i=0;i<9;i++){const bx=i*w/8; const bh=45+(i*37%100); x.fillStyle=i%2?'#223346':'#1c2c3d'; x.fillRect(bx,h*.5-bh,w/10,bh); for(let j=0;j<3;j++){x.fillStyle='#8df4df';x.fillRect(bx+8+j*18,h*.5-bh+12,7,9)}}
    const horizon=h*.52; x.fillStyle='#202a35'; x.beginPath(); x.moveTo(w*.32,horizon);x.lineTo(w*.68,horizon);x.lineTo(w*1.12,h);x.lineTo(-w*.12,h);x.closePath();x.fill()
    x.strokeStyle='#6e7e8e';x.lineWidth=5; for(const a of [.39,.61]){x.beginPath();x.moveTo(w*a,horizon);x.lineTo(w*(a<.5?-.03:1.03),h);x.stroke()}
    for(let i=0;i<3;i++){const px=w*(.42+i*.08);x.strokeStyle='#384655';x.lineWidth=2;x.beginPath();x.moveTo(px,horizon);x.lineTo(w*(.2+i*.3),h);x.stroke()}
    this.obstacles.forEach(o=>{const z=o.z, yy=horizon+(h-horizon)*z*z, laneX=w*(.42+o.lane*.08)+((o.lane-1)*w*.24)*z, size=18+z*66;if(o.hit)return
      if(o.kind==='coin'){x.fillStyle='#ffd447';x.fillRect(laneX-size*.2,yy-size*.48,size*.4,size*.4);x.fillStyle='#fff2a1';x.fillRect(laneX-size*.07,yy-size*.39,size*.12,size*.22)}
      else {x.fillStyle=o.kind==='train'?'#de754a':'#dd5959';x.fillRect(laneX-size/2,yy-size,size,size);x.fillStyle=o.kind==='train'?'#ffcb7a':'#ffc06a';x.fillRect(laneX-size*.35,yy-size*.8,size*.7,size*.2);x.fillStyle='#4a3240';x.fillRect(laneX-size*.35,yy-size*.26,size*.7,size*.26)}})
    const px=w*(.42+this.lane*.08), py=h*.81-this.jump*75; x.fillStyle='#a1f45e';x.fillRect(px-17,py-38,34,38);x.fillStyle='#30d5ee';x.fillRect(px-13,py-57,26,21);x.fillStyle='#1e2836';x.fillRect(px-22,py-7,16,9);x.fillRect(px+6,py-7,16,9);x.fillStyle='#13202b';x.fillRect(px-7,py-49,5,5);x.fillRect(px+3,py-49,5,5)
    if(this.slide>0){x.fillStyle='rgba(161,244,94,.35)';x.fillRect(px-29,h*.84,58,12)}
  }
}