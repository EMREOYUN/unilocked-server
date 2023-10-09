export default function authorize(
  req: Express.Request,
  permission: string,
  object: any,
  field: string = "user"
) {
  if (!req.user) {
    return false;
  }

  if (object.user && object[field] == req.user._id) {
    return true;
  }

  const permissions = new Set<string>(); //To avoid duplicate permissions.
  req.user?.roles?.forEach((role:any) => {
    role.permissions.forEach((permission) => {
      permissions.add(permission); //Get all the permissions the user has.
    });
  });
  
  return permissions.has(permission);
}
