---
title: ROS 2 Jazzy 開発の基本手順書（Pythonノード編）
date: 2026-05-06
styleVersion: "20260506-inline"
output: memos/raspberry-pi5-ubuntu-ros2-jazzy-setup.html
highlight: true
---

## 前提環境

- OS: **Ubuntu 24.04**
- ROS 2: **Jazzy Jalisco**
- ビルドツール: **colcon**
- 対象: **Raspberry Pi 5 上での Python ノード開発**

## 1. ワークスペースの作成

まずは開発用ワークスペースを作る。複数の ROS 2 パッケージをまとめて管理する作業ルートになる。

```bash
mkdir -p ~/auto_ws/src
cd ~/auto_ws/src
```

## 2. パッケージの作成

`ament_python` 形式でパッケージを作成し、ROS 2 Python API（`rclpy`）を依存として宣言する。

```bash
ros2 pkg create --build-type ament_python my_first_package --dependencies rclpy
```

## 3. ノードファイルの作成

作成したパッケージ内の `simple_node.py` を、VSCode のリモートエディタ上で以下の内容に編集する。

```bash
cd ~/auto_ws/src/my_first_package/my_first_package
code simple_node.py
```

```python simple_node.py
import rclpy
from rclpy.node import Node

class SimpleNode(Node):
    def __init__(self):
        # ノード名を 'simple_node' として初期化
        super().__init__('simple_node')
        self.get_logger().info('Raspberry Pi 5 ROS2 Jazzy Node started!')
        
        # 1.0秒ごとに timer_callback を実行するタイマーを作成
        self.timer = self.create_timer(1.0, self.timer_callback)
        self.count = 0

    def timer_callback(self):
        self.get_logger().info(f'Running... Count: {self.count}')
        self.count += 1

def main(args=None):
    rclpy.init(args=args)
    node = SimpleNode()
    
    try:
        # ノードをスピン（実行維持）させる
        rclpy.spin(node)
    except KeyboardInterrupt:
        # Ctrl+C で安全に終了
        pass
    finally:
        node.destroy_node()
        if rclpy.ok():  # まだシャットダウンされていなければ実行する
            rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 4. エントリポイントの登録

`ros2 run` で実行できるよう、`setup.py` の `console_scripts` に実行エントリを追加する。ファイルは VSCode のリモートエディタ上で編集する。

```bash
cd ~/auto_ws/src/my_first_package
code setup.py
```

追記内容:

```python setup.py（抜粋）
entry_points={
    'console_scripts': [
        'simple_node = my_first_package.simple_node:main',
    ],
},
```

## 5. ワークスペースのビルド

`--symlink-install` を使うと Python ファイル編集後の再ビルド頻度を下げられ、開発サイクルが速くなる。

```bash
cd ~/auto_ws
colcon build --symlink-install
```

## 6. 環境反映とノード実行

ビルド後はオーバーレイを読み込み、作成したノードを実行する。

```bash
source ~/auto_ws/install/setup.bash
ros2 run my_first_package simple_node
```

## 7. つまずきやすいポイント

- `source ~/auto_ws/install/setup.bash` を忘れるとパッケージ未検出エラーになる。
- `setup.py` の `console_scripts` 未登録だと `ros2 run` で起動できない。
- 新規パッケージ追加時や設定変更時は再ビルドが必要。

## 8. 完了条件

`ros2 run my_first_package simple_node` 実行後、周期的なログ（例: `Running... Count: X`）が出れば、基本開発サイクルは完了。

```text
[INFO] [xxxx] [simple_node]: Running... Count: 1
[INFO] [xxxx] [simple_node]: Running... Count: 2
[INFO] [xxxx] [simple_node]: Running... Count: 3
```
