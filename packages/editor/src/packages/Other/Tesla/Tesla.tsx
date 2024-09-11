import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import { ComponentType } from '@/packages/types';
import {
  Color,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  HemisphereLightHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface TeslaConfig {
  width: number;
  height: number;
  isAutoFun: boolean;
  color: string;
}
const Tesla = ({ id, type, config }: ComponentType<TeslaConfig>, ref: any) => {
  const loader = new GLTFLoader(); //引入模型的loader实例
  const defaultMap = {
    x: 0,
    y: 0,
    z: 3,
  }; // 相机的默认坐标
  const [map, setMap] = useState(defaultMap); //把相机坐标设置成可观察对象
  let scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer, controls: OrbitControls, dhelper, hHelper, directionalLight, hemisphereLight; // 定义所有three实例变量

  // 创建场景
  const setScene = () => {
    scene = new Scene();
    renderer = new WebGLRenderer();
    scene.background = new Color('#0D162F');
    renderer.setSize(config.props.width, config.props.height);
    const teslaBox = document.querySelector('.TeslaBox') as HTMLElement;
    if (teslaBox.firstChild) teslaBox?.removeChild(teslaBox.firstChild);
    document.querySelector('.TeslaBox')?.appendChild(renderer.domElement);
  };

  //创建灯光
  const setLight = () => {
    directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-4, 8, 4);
    dhelper = new DirectionalLightHelper(directionalLight, 5, 0xff0000);
    hemisphereLight = new HemisphereLight(0xffffff, 0xffffff, 0.4);
    hemisphereLight.position.set(0, 8, 0);
    hHelper = new HemisphereLightHelper(hemisphereLight, 5);
    scene.add(directionalLight);
    scene.add(hemisphereLight);
  };

  // 创建相机
  const setCamera = () => {
    const { x, y, z } = defaultMap;
    camera = new PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
    camera.position.set(x, y, z);
  };

  // 设置模型控制
  const setControls = () => {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = (0.9 * Math.PI) / 2;
    controls.enableZoom = true;
    controls.addEventListener('change', render);
  };

  //返回坐标信息
  const render = () => {
    const { x, y, z } = camera.position;
    setMap({
      x,
      y,
      z,
    });
  };

  // 循环场景 、相机、 位置更新
  const loop = () => {
    requestAnimationFrame(loop);
    renderer.render(scene, camera);
    controls.update();
  };

  //是否自动转动
  const isAutoFun = () => {
    controls.autoRotate = true;
  };
  //停止转动
  const stop = () => {
    controls.autoRotate = false;
  };

  //设置车身颜色
  const setCarColor = (color: string) => {
    const currentColor = new Color(color);
    scene.traverse((child: any) => {
      if (child.isMesh) {
        if (child.name.includes('door_')) {
          child.material.color.set(currentColor);
        }
      }
    });
  };

  const loadFile = useCallback((url: string) => {
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (gltf: any) => {
          resolve(gltf);
        },
        ({ loaded, total }: any) => {
          console.log((loaded / total) * 100 + '% loaded');
        },
        () => {
          reject('load error');
        },
      );
    });
  }, []);

  //初始化所有函数
  const init = async () => {
    setScene();
    setCamera();
    setLight();
    setControls();
    const gltf: any = await loadFile('https://marsview.cdn.bcebos.com/resource/scene.gltf');
    scene?.add(gltf?.scene);
    loop();
    if (config.props.isAutoFun) isAutoFun();

    setCarColor(config.props.color);
  };

  useEffect(() => {
    init();
    setCarColor(config.props.color);
  }, [config.props]);
  return <div className="TeslaBox" style={config.style} data-id={id} data-type={type}></div>;
};

export default forwardRef(Tesla);
