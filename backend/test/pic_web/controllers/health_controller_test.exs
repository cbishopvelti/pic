defmodule PicWeb.HealthControllerTest do
  use PicWeb.ConnCase

  test "GET /api/health", %{conn: conn} do
    assert json_response(get(conn, ~p"/api/health"), 200) == %{"status" => "ok"}
  end
end
