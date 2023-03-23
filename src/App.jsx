import { Canvas } from '@react-three/fiber'
import { Stats, OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { MeshStandardMaterial } from 'three';


const Models = [
  {
    title: 'Frame 1000 to 1500mm',
    url: '../public/desktop_pc/R3030ST2rotated.gltf',
    category: 'Frames'
  },
  {
    title: 'Tabletop E3 T2',
    url: '../public/desktop_pc/E3_T2valamu.gltf',
    category: 'Tabeltops'
  },
  {
    title: 'Tabletop E1 T0',
    url: '../public/desktop_pc/E1_T0valamu.gltf',
    category: 'Tabeltops'
  },

]

function setColor(scene, color) {
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshStandardMaterial({ color });
      child.material.needsUpdate = true;
    }
  });
}

function Model({ url, color, position }) {
  const { scene } = useGLTF(url);
  setColor(scene, color);
  return <primitive object={scene} position={position} />;
}

export default function App() {
  const categories = Array.from(new Set(Models.map((model) => model.category)));

  const modelControls = categories.reduce((acc, category) => {
    acc[category] = {
      value: null,
      options: Models.filter((model) => model.category === category).reduce((options, model) => {
        options[model.title] = model.title;
        return options;
      }, {}),
      label: `${category}`,
    };
    return acc;
  }, {});

  const selectedModels = useControls(modelControls);


  const modelZPositions = {
    0: 0, // Raam
    1: 470, // Tasapind E3 T2
    2: 350, // Tasapind E1 T0
  };

  function MyEnvironment(props) {
    return <Environment background={false} files="white.png" {...props} />;
  }

  const filteredModels = Models.filter((model) => Object.values(selectedModels).includes(model.title));

  return (
    <>
      <Canvas camera={{ position: [1000, 1000, 1500], near: 0.1, far: 7000, fov: 50 }}>
        <pointLight intensity={1} position={[0, 10, 0]} />
        <MyEnvironment preset="studio" />
        <group>
          {filteredModels.map((model) => (
            <Model
              key={model.title}
              url={model.url}
              color="#7D7D7D"
              position={[
                0,
                modelZPositions[Models.findIndex((m) => m.title === model.title)],
                0,
              ]}
            />
          ))}
        </group>
        <OrbitControls autoRotate={false} enablePan={true} />
      </Canvas>
    </>
  );
}