import BranchTable from "./BranchTable";

export default function BranchesTab({ branches }) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Branches</h2>
            <BranchTable branches={branches} />
        </div>
    );
}