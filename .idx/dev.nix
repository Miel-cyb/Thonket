{pkgs}: {
  channel = "stable-24.05";
  packages = [ pkgs.nodejs_20 ];
  idx.extensions = [ "svelte.svelte-vscode" "vue.volar" ];
  idx.previews = {
    previews = {
      web = {
        command = [ "sh" "-c" "vite --host 0.0.0.0 --port $PORT & json-server --watch src/data/ordersData.json --port 3000" ];
        manager = "web";
      };
    };
  };
}