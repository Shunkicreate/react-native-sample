module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'], // Expoプロジェクトの場合
      plugins: [
        [
          'module-resolver',
          {
            root: ['./'], // プロジェクトルートをベースに
            alias: {
              '@': './', // TypeScriptで定義した`@`エイリアスを同じように設定
            },
            extensions: ['.ts', '.tsx', '.js', '.json'], // 解決するファイル拡張子
          },
        ],
      ],
    };
  };
  