import router from "express";
const route = router.Router();
import controllers from "../controllers";

route.post("/add", controllers.createUser);
route.get("/get", controllers.getUsers);
route.put("/update/:id?", controllers.updateUser);
route.delete("/delete/:id", controllers.deleteUser);

export default route;
