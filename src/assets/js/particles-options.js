const obj={
  background: {
  color: {
    value: '#fff'
  }
},
fpsLimit: 60,
  interactivity: {
  detectsOn: 'window',
    events: {
    onClick: {
      enable: true,
        mode: 'push'
    },
    onHover: {
      enable: true,
        mode: 'repulse'
    },
    resize: true
  },
  modes: {
    bubble: {
      distance: 500,
        duration: 2,
        opacity: 0.8,
        size: 40,
        speed: 3
    },
    push: {
      quantity: 4
    },
    repulse: {
      distance: 100,
        duration: 0.4
    }
  }
},
particles: {
  color: {
    value: '#fff'
  },
  links: {
    color: '#0db4e7',
      distance: 50,
      enable: true,
      opacity: 0.8,
      width: 1
  },
  collisions: {
    enable: true
  },
  move: {
    direction: 'none',
      enable: true,
      outMode: 'bounce',
      random: true,
      speed: 2,
      straight: true
  },
  number: {
    density: {
      enable: true,
        value_area: 500
    },
    value: 100
  },
  opacity: {
    value: 0.5
  },
  shape: {
    type: 'circle',

  },
  size: {
    random: true,
      value: 5
  }
},
detectRetina: true
}
export default obj;