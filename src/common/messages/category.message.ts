export enum categorySuccessMessage {
    created = "category created successfully",
    updated = "category updated successfully",
    deleted = "category deleted successfully"
}

export enum categoryErrorMessage {
    conflict = "category exist",
    notfound = "category not exist",
    notFoundParent = "parent is not found please change the parentId",
    slugConflict = "slug is not unique please try another one"
}