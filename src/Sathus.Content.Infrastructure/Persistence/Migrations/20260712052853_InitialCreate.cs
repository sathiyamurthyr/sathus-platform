using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sathus.Content.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Slug = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Description = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "content_items",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Slug = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Description = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    Body = table.Column<string>(type: "text", nullable: false),
                    ContentType = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    PublishedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AuthorId = table.Column<Guid>(type: "uuid", nullable: true),
                    SeoCanonical = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    SeoRobots = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    NoIndex = table.Column<bool>(type: "boolean", nullable: false),
                    OgImage = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    FocusKeyword = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Featured = table.Column<bool>(type: "boolean", nullable: false),
                    NavigationTitle = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: true),
                    PreviousContentItemId = table.Column<Guid>(type: "uuid", nullable: true),
                    NextContentItemId = table.Column<Guid>(type: "uuid", nullable: true),
                    Difficulty = table.Column<int>(type: "integer", nullable: true),
                    EstimatedReadTime = table.Column<int>(type: "integer", nullable: true),
                    Deprecated = table.Column<bool>(type: "boolean", nullable: false),
                    Tagline = table.Column<string>(type: "text", nullable: true),
                    FeaturesJson = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    PricingPlanId = table.Column<Guid>(type: "uuid", nullable: true),
                    CoverImage = table.Column<string>(type: "text", nullable: true),
                    ReadTime = table.Column<int>(type: "integer", nullable: true),
                    HeroImage = table.Column<string>(type: "text", nullable: true),
                    GalleryJson = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_content_items", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "media_assets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Filename = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    OriginalName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    MimeType = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Size = table.Column<long>(type: "bigint", nullable: false),
                    Url = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    AltText = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_media_assets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tags",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Slug = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "content_item_categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContentItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_content_item_categories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_content_item_categories_categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_content_item_categories_content_items_ContentItemId",
                        column: x => x.ContentItemId,
                        principalTable: "content_items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "content_item_tags",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContentItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_content_item_tags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_content_item_tags_content_items_ContentItemId",
                        column: x => x.ContentItemId,
                        principalTable: "content_items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_content_item_tags_tags_TagId",
                        column: x => x.TagId,
                        principalTable: "tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_categories_Slug",
                table: "categories",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_content_item_categories_CategoryId",
                table: "content_item_categories",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_content_item_categories_ContentItemId",
                table: "content_item_categories",
                column: "ContentItemId");

            migrationBuilder.CreateIndex(
                name: "IX_content_item_tags_ContentItemId",
                table: "content_item_tags",
                column: "ContentItemId");

            migrationBuilder.CreateIndex(
                name: "IX_content_item_tags_TagId",
                table: "content_item_tags",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_content_items_ContentType_Status_DisplayOrder",
                table: "content_items",
                columns: new[] { "ContentType", "Status", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_content_items_ContentType_Status_PublishedAt",
                table: "content_items",
                columns: new[] { "ContentType", "Status", "PublishedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_content_items_Slug",
                table: "content_items",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_media_assets_Filename",
                table: "media_assets",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_tags_Slug",
                table: "tags",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "content_item_categories");

            migrationBuilder.DropTable(
                name: "content_item_tags");

            migrationBuilder.DropTable(
                name: "media_assets");

            migrationBuilder.DropTable(
                name: "categories");

            migrationBuilder.DropTable(
                name: "content_items");

            migrationBuilder.DropTable(
                name: "tags");
        }
    }
}
