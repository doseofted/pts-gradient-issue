/* @refresh reload */
import { render } from 'solid-js/web';
import { CanvasSpace, Circle, Pt } from "pts"
import { createSignal, onCleanup, onMount } from 'solid-js';

// setup PTS
function setupPts (space: CanvasSpace) {
  space.setup({ bgcolor: "white", resize: true })
  const form = space.getForm()
  space.add(() => {
    if (!space) { return }
    const circleSize = 250
    const colorStart = "white"
    const colorEnd = "teal"
    const pointer = new Pt(mouse())
    const center = pointer.subtract({ x: window.innerWidth / 4, y: window.innerHeight / 4 })
    setPtsCenter({ x: center.x, y: center.y })
    const gradientColor = form.gradient([colorStart, colorEnd])
    const gradientShape = gradientColor(
      Circle.fromCenter(center, 0),
      Circle.fromCenter(center, circleSize),
    )
    form.fill(gradientShape).stroke(false).circle(Circle.fromCenter(center, circleSize))
  })
  space.play()
}

// track mouse position
const [mouse, setMouse] = createSignal({ x: 0, y: 0 })
const [ptsCenter, setPtsCenter] = createSignal({ x: 0, y: 0 })

// setup HTML
render(() => {
	let canvas: HTMLCanvasElement | undefined
  let space: CanvasSpace | undefined
  onMount(() => {
		if (!canvas) { return } 
		space = new CanvasSpace(canvas)
		setupPts(space)
	})
	onCleanup(() => {
		space?.dispose()
	})
  const centerStyle = { display: 'flex', "justify-content": "center", "align-items": "center", width: "100%", height: "100vh" }
  return <>
    <div onMouseMove={({ x, y }) => setMouse({ x, y })} style={centerStyle}>
      <div style={{ width: '50%', height: '50vh' }}>
        <canvas style={{ border: "1px solid black" }} ref={ref => canvas = ref} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 0, left: 0, "font-family": "sans-serif", padding: "1rem", "pointer-events": "none" }}>
      gradient position in canvas: {ptsCenter().x} {ptsCenter().y}
    </div>
  </>
}, document.getElementById('root') as HTMLElement);
